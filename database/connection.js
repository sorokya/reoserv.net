import Database from 'better-sqlite3';

const db = new Database('./reoserv.db');

// Recommended SQLite pragmas for performance and integrity
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 5000');

function setupSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE,
      prefix TEXT,
      title TEXT,
      description TEXT,
      date TEXT,
      lastmod TEXT,
      etag TEXT,
      content TEXT
    );

    CREATE TABLE IF NOT EXISTS commits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      commit_id TEXT UNIQUE,
      link TEXT,
      content TEXT,
      timestamp TEXT
    );

    CREATE TABLE IF NOT EXISTS latest_release (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      timestamp TEXT,
      link TEXT
    );

    CREATE TABLE IF NOT EXISTS last_refreshed (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT UNIQUE,
      timestamp TEXT
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS content_fts USING fts5(
      title, content, prefix, slug, content='content', content_rowid='id'
    );
  `);

  db.exec(`
    CREATE TRIGGER IF NOT EXISTS content_ai AFTER INSERT ON content
    BEGIN
      INSERT INTO content_fts(rowid, title, content, prefix, slug)
      VALUES (new.id, new.title, new.content, new.prefix, new.slug);
    END;

    CREATE TRIGGER IF NOT EXISTS content_au AFTER UPDATE ON content
    BEGIN
      UPDATE content_fts SET title = new.title, content = new.content, prefix = new.prefix, slug = new.slug
      WHERE rowid = new.id;
    END;

    CREATE TRIGGER IF NOT EXISTS content_ad AFTER DELETE ON content
    BEGIN
      DELETE FROM content_fts WHERE rowid = old.id;
    END;
  `);
}

setupSchema();

export { db };
