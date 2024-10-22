import db from '../../../../database/connection';

async function fetchWithETag(url, type) {
  const etag =
    db
      .prepare('SELECT etag FROM last_refreshed WHERE type = :type')
      .get({ type })?.etag || '';

  const response = await fetch(url, {
    headers: { 'If-None-Match': etag },
  });

  if (response.status === 304) {
    return null; // No update needed
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch ${type}`);
  }

  const newEtag = response.headers.get('etag');
  const data = await response.json();

  db.prepare(
    'INSERT OR REPLACE INTO last_refreshed (type, timestamp, etag) VALUES (:type, :timestamp, :etag)',
  ).run({ type, timestamp: new Date().toISOString(), etag: newEtag });

  return data;
}

export { fetchWithETag };
