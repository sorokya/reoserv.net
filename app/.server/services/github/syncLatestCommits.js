import db from '../../../../database/connection';
import { GITHUB_COMMITS_URL } from '../../constants';
import { fetchWithETag } from './fetchWithETag';

function insertMany(commits) {
  const insert = db.prepare(`
    INSERT INTO commits (commit_id, link, content, timestamp)
    VALUES (:commit_id, :link, :content, :timestamp)
    ON CONFLICT(commit_id) DO UPDATE SET
      link=excluded.link,
      content=excluded.content,
      timestamp=excluded.timestamp
  `);

  return db.transaction(() => {
    for (const commit of commits) {
      insert.run(commit);
    }
  });
}

export async function syncLatestCommits() {
  const feed = await fetchWithETag(GITHUB_COMMITS_URL, 'commits');

  if (!feed) {
    return db
      .prepare('SELECT commit_id, link, content, timestamp FROM commits')
      .all();
  }

  const gitFeed = feed.items.map((item) => ({
    id: item.id,
    link: item.link,
    content: item.title,
    timestamp: item.created,
  }));

  insertMany(gitFeed);

  return gitFeed;
}
