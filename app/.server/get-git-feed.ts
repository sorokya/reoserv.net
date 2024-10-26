import fs from 'node:fs';
import { getClockOffset } from './utils/clock-offset';
import { getPrettyDate } from './utils/pretty-date';

type GithubCommitFeed = Array<{
  sha: string;
  html_url: string;
  commit: {
    message: string;
    committer: { date: string };
  };
}>;

type Commit = {
  id: string;
  link: string;
  content: string;
  timestamp: string;
};

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

  const fileContents = fs.readFileSync(DATA_FILE_PATH, { encoding: 'utf8' });
  const json = JSON.parse(fileContents) as Commit[];
  return json;
}

async function fetchGitFeed(request: Request) {
  const clockOffset = getClockOffset(request);

  const response = await fetch(
    'https://api.github.com/repos/sorokya/reoserv/commits?sha=master&per_page=30',
  );

  if (!response.ok) {
    throw new Error('Failed to fetch commits from github');
  }

  const feed = (await response.json()) as GithubCommitFeed;

  return feed.map(({ sha, html_url, commit }) => ({
    id: sha,
    link: html_url,
    content: commit.message.split(/\r?\n/)[0],
    timestamp: getPrettyDate(commit.committer.date, clockOffset),
  }));
}

export { getGitFeed };
