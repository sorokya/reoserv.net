import fs from 'node:fs';
import { z } from 'zod';

const GithubCommitsAPISchema = z.array(
  z.object({
    sha: z.string().min(1),
    html_url: z.string().url().min(1),
    commit: z.object({
      message: z.string().min(1),
      committer: z.object({
        date: z.string().datetime().min(1),
      }),
    }),
  }),
);

const StoredCommitsSchema = z.array(
  z.object({
    id: z.string().min(1),
    link: z.string().url().min(1),
    content: z.string().min(1),
    timestamp: z.string().datetime().min(1),
  }),
);

const GITHUB_URL =
  'https://api.github.com/repos/sorokya/reoserv/commits?sha=master&per_page=20';
const DATA_FILE_PATH = 'git-feed.json';
const MAX_FILE_AGE = 5 * 60 * 1000; // 5 minutes in milliseconds

async function getGitFeed() {
  // Check file age or existence
  const fileStats =
    fs.existsSync(DATA_FILE_PATH) && fs.statSync(DATA_FILE_PATH);
  const fileAge = fileStats
    ? Date.now() - fileStats.mtime.getTime()
    : Number.POSITIVE_INFINITY;

  if (!fileStats || fileAge > MAX_FILE_AGE) {
    const commits = await fetchGitFeed();
    const json = JSON.stringify(commits);
    fs.writeFileSync(DATA_FILE_PATH, json);
    return commits;
  }

  const fileContents = fs.readFileSync(DATA_FILE_PATH, { encoding: 'utf8' });
  const json = JSON.parse(fileContents);
  const commits = StoredCommitsSchema.parse(json);

  return commits;
}

async function fetchGitFeed() {
  const response = await fetch(GITHUB_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch commits from github');
  }

  const commits = GithubCommitsAPISchema.parse(await response.json());

  return commits.map((commit) => ({
    id: commit.sha,
    link: commit.html_url,
    content: commit.commit.message.split(/\r?\n/)[0],
    timestamp: new Date(commit.commit.committer.date).toISOString(),
  }));
}

export { getGitFeed };
