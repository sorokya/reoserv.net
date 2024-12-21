import fs from 'node:fs/promises';
import { glob } from 'glob';
import { parseMarkdown } from './utils/parse-markdown';

type Content = Awaited<ReturnType<typeof parseMarkdown>>;
type ContentValue = { content: Content; mtimeMs: number };
type ContentStore = Record<string, ContentValue>;

// Simple in-memory store
let contentStore: ContentStore | null = null;

async function getFileContent(
  filePath: string,
  cached?: ContentValue,
): Promise<ContentValue> {
  const stats = await fs.stat(filePath);

  if (cached && cached.mtimeMs === stats.mtimeMs) {
    return cached;
  }

  const content = await parseMarkdown(filePath);
  return { content, mtimeMs: stats.mtimeMs };
}

async function loadAllContent(): Promise<ContentStore> {
  const files = await glob('content/**/*.md');

  const contents = await Promise.all(
    files.map(async (filePath) => {
      const key = filePath.replace(/^content\//, '').replace(/\.md$/, '');

      try {
        const content = await getFileContent(filePath, contentStore?.[key]);
        return [key, content] as const;
      } catch (error) {
        console.error(`Failed to load content for ${key}:`, error);
        return undefined;
      }
    }),
  );

  return Object.fromEntries(contents.filter(Boolean));
}

async function getStore(): Promise<ContentStore> {
  if (process.env.NODE_ENV === 'development' || !contentStore) {
    contentStore = await loadAllContent();
  }
  return contentStore;
}

async function getContentByType(
  type: string,
): Promise<Record<string, Content>> {
  const store = await getStore();
  return Object.fromEntries(
    Object.entries(store)
      .filter(([key]) => key.startsWith(`${type}/`))
      .map(([key, data]) => [key, data.content]),
  );
}

async function getContentByKey(key: string): Promise<Content | undefined> {
  const store = await getStore();
  return store[key]?.content;
}

export { getContentByKey, getContentByType };
