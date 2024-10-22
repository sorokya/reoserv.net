import fs from 'node:fs/promises';
import path from 'node:path';
import { db } from '../../../../database/connection';
import { parseMarkdown } from '../../utils/parse-markdown';

async function syncContent() {
  const contentDir = path.resolve(__dirname, '../../../content');
  const subDirs = ['docs', 'news'];
  const allFiles = [];

  for (const subDir of subDirs) {
    const dirPath = path.join(contentDir, subDir);
    const files = await fs.readdir(dirPath);
    allFiles.push(...files.map((file) => path.join(dirPath, file)));
  }

  const parsedFiles = await Promise.all(allFiles.map(parseMarkdown));

  const insertStmt = db.prepare(`
    INSERT INTO content (slug, prefix, title, description, date, lastmod, etag, content)
    VALUES (:slug, :prefix, :title, :description, :date, :lastmod, :etag, :content)
    ON CONFLICT(slug) DO UPDATE SET
      title=excluded.title,
      description=excluded.description,
      date=excluded.date,
      lastmod=excluded.lastmod,
      etag=excluded.etag,
      content=excluded.content
  `);

  db.transaction(() => {
    for (const parsed of parsedFiles) {
      const slug = path.basename(parsed.filePath, '.md');
      const prefix = parsed.filePath.split(path.sep)[
        parsed.filePath.split(path.sep).length - 3
      ];
      insertStmt.run({
        slug,
        prefix,
        title: parsed.title,
        description: parsed.description,
        date: parsed.date,
        lastmod: parsed.lastmod,
        etag: parsed.etag,
        content: parsed.content,
      });
    }
  });
}

export { syncContent };
