import fs from './fs.server';
import { getClockOffset } from './get-clock-offset.server';
import { getPrettyDate } from './get-pretty-date.server';

const GITHUB_URL =
  'https://api.github.com/repos/sorokya/reoserv/releases/latest';
const DATA_FILE_PATH = 'latest-release.json';
const MAX_FILE_AGE = 5 * 60 * 1000; // 5 minutes in milliseconds

async function getLatestRelease(request) {
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

  const json = fs.readFileSync(DATA_FILE_PATH);
  return JSON.parse(json);
}

async function fetchLatestRelease(request) {
  const clockOffset = getClockOffset(request);
  const response = await fetch(GITHUB_URL);

  if (!response.ok) {
    return { error: 'Failed to fetch github release' };
  }

  const release = await response.json();

  return {
    name: release.name,
    timestamp: getPrettyDate(release.published_at, clockOffset),
    link: release.html_url,
  };
}

export { getLatestRelease };
