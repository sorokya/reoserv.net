import fs from 'node:fs';
import { getClockOffset } from './utils/clock-offset';
import { getPrettyDate } from './utils/pretty-date';

type GithubRelease = {
  name: string;
  published_at: number;
  html_url: string;
};

type LatestRelease = {
  name: string;
  timestamp: string;
  link: string;
};

const GITHUB_URL =
  'https://api.github.com/repos/sorokya/reoserv/releases/latest';
const DATA_FILE_PATH = 'latest-release.json';
const MAX_FILE_AGE = 5 * 60 * 1000; // 5 minutes in milliseconds

async function getLatestRelease(request: Request) {
  // Check file age or existence
  const fileStats =
    fs.existsSync(DATA_FILE_PATH) && fs.statSync(DATA_FILE_PATH);
  const fileAge = fileStats
    ? Date.now() - fileStats.mtime.getTime()
    : Number.POSITIVE_INFINITY;

  if (!fileStats || fileAge > MAX_FILE_AGE) {
    const latestRelease = await fetchLatestRelease(request);
    const json = JSON.stringify(latestRelease);
    fs.writeFileSync(DATA_FILE_PATH, json);
    return latestRelease;
  }

  const fileContents = fs.readFileSync(DATA_FILE_PATH, { encoding: 'utf8' });
  const json = JSON.parse(fileContents) as LatestRelease;
  return json;
}

async function fetchLatestRelease(request: Request) {
  const clockOffset = getClockOffset(request);
  const response = await fetch(GITHUB_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch the latest release from github');
  }

  const release = (await response.json()) as GithubRelease;

  return {
    name: release.name,
    timestamp: getPrettyDate(release.published_at, clockOffset),
    link: release.html_url,
  };
}

export { getLatestRelease };
