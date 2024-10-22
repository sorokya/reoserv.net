import db from '../../../../database/connection';
import { GITHUB_RELEASE_URL } from '../../constants';
import { fetchWithETag } from './fetchWithETag';

export async function syncLatestRelease() {
  const release = await fetchWithETag(GITHUB_RELEASE_URL, 'latest_release');

  if (!release) {
    return db.prepare('SELECT name, timestamp, link FROM latest_release').get();
  }

  db.prepare(`
    INSERT INTO latest_release (name, timestamp, link)
    VALUES (:name, :timestamp, :link)
    ON CONFLICT(name) DO UPDATE SET
      timestamp=excluded.timestamp,
      link=excluded.link
  `).run({
    name: release.name,
    timestamp: release.published_at,
    link: release.html_url,
  });

  return release;
}
