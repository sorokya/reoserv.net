import fs from 'node:fs';
import { z } from 'zod';

const GithubReleaseAPISchema = z.object({
  name: z.string().min(1),
  published_at: z.string().datetime().min(1),
  html_url: z.string().url().min(1),
});

const LatestReleaseSchema = z.object({
  name: z.string().min(1),
  timestamp: z.string().datetime(),
  link: z.string().url().min(1),
});

const GITHUB_URL =
  'https://api.github.com/repos/sorokya/reoserv/releases/latest';
const DATA_FILE_PATH = 'latest-release.json';
const MAX_FILE_AGE = 5 * 60 * 1000; // 5 minutes in milliseconds

async function getLatestRelease() {
  // Check file age or existence
  const fileStats =
    fs.existsSync(DATA_FILE_PATH) && fs.statSync(DATA_FILE_PATH);
  const fileAge = fileStats
    ? Date.now() - fileStats.mtime.getTime()
    : Number.POSITIVE_INFINITY;

  if (!fileStats || fileAge > MAX_FILE_AGE) {
    const latestRelease = await fetchLatestRelease();
    const json = JSON.stringify(latestRelease);
    fs.writeFileSync(DATA_FILE_PATH, json);
    return latestRelease;
  }

  const fileContents = fs.readFileSync(DATA_FILE_PATH, { encoding: 'utf8' });
  const json = JSON.parse(fileContents);
  const latestRelease = LatestReleaseSchema.parse(json);
  return latestRelease;
}

async function fetchLatestRelease() {
  const response = await fetch(GITHUB_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch the latest release from github');
  }

  const release = GithubReleaseAPISchema.parse(await response.json());

  return {
    name: release.name,
    timestamp: new Date(release.published_at).toISOString(),
    link: release.html_url,
  };
}

export { getLatestRelease };
