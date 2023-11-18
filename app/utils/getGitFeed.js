import fs from './fs.server';
import rssToJson from 'rss-to-json';
const { parse } = rssToJson;
import getPrettyDate from './getPrettyDate';

const GITHUB_FEED = 'https://github.com/sorokya/reoserv/commits/master.atom';
const DATA_FILE_PATH = 'git-feed.json';
const MAX_FILE_AGE = 5 * 60 * 1000; // 5 minutes in milliseconds

export default async function getGitFeed(request) {
  // Check file age or existence
  const fileStats =
    fs.existsSync(DATA_FILE_PATH) && fs.statSync(DATA_FILE_PATH);
  const fileAge = fileStats ? Date.now() - fileStats.mtime.getTime() : Infinity;

  if (!fileStats || fileAge > MAX_FILE_AGE) {
    const gitFeed = await fetchGitFeed(request);
    const json = JSON.stringify(gitFeed);
    fs.writeFileSync(DATA_FILE_PATH, json);
    return gitFeed;
  }

  const json = fs.readFileSync(DATA_FILE_PATH);
  return JSON.parse(json);
}

async function fetchGitFeed(request) {
  const clockOffset = request.headers.get('Cookie')?.match(/clockOffset=(\d+)/);
  const feed = await parse(GITHUB_FEED);
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
