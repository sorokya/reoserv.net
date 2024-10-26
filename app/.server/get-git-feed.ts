import fs from 'node:fs';
import RssParser from 'rss-parser';
import { getClockOffset } from './utils/clock-offset';
import { getPrettyDate } from './utils/pretty-date';

type Commit = {
  id: string;
  link: string;
  title: string;
  created: number;
};

const rssParser = new RssParser();

const GITHUB_FEED = 'https://github.com/sorokya/reoserv/commits/master.atom';
const DATA_FILE_PATH = 'git-feed.json';
const MAX_FILE_AGE = 5 * 60 * 1000; // 5 minutes in milliseconds

async function getGitFeed(request: Request) {
  // Check file age or existence
  const fileStats =
    fs.existsSync(DATA_FILE_PATH) && fs.statSync(DATA_FILE_PATH);
  const fileAge = fileStats
    ? Date.now() - fileStats.mtime.getTime()
    : Number.POSITIVE_INFINITY;

  if (!fileStats || fileAge > MAX_FILE_AGE) {
    const gitFeed = await fetchGitFeed(request);
    const json = JSON.stringify(gitFeed);
    fs.writeFileSync(DATA_FILE_PATH, json);
    return gitFeed;
  }

  const fileContents = fs.readFileSync(DATA_FILE_PATH, 'utf8');
  const json = JSON.parse(fileContents) as Commit[];
  return json;
}

async function fetchGitFeed(request: Request) {
  const clockOffset = getClockOffset(request);
  const feed = (await rssParser.parseURL(GITHUB_FEED)) as { items: Commit[] };

  console.log({ feed });

  if (!feed) {
    return [];
  }

  return feed.items.map((item) => ({
    id: item.id,
    link: item.link,
    content: item.title,
    timestamp: getPrettyDate(item.created, clockOffset),
  }));
}

export { getGitFeed };
