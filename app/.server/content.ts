import fs from 'node:fs/promises';
import path from 'node:path';
import { parseMarkdown } from './utils/parse-markdown';

type ContentType = 'news' | 'docs';

interface ContentStore {
  [key: string]: {
    [slug: string]: Awaited<ReturnType<typeof parseMarkdown>>;
  };
}

interface ContentMeta {
  [filePath: string]: number; // Last modified timestamp
}

// Simple in-memory store
let contentStore: ContentStore | null = null;
const contentMeta: ContentMeta = {};

async function loadContentType(type: ContentType) {
  const dirPath = path.join('content', type);
  const files = await fs.readdir(dirPath);

  const contents = await Promise.all(
    files
      .filter((file) => file.endsWith('.md'))
      .map(async (file) => {
        const slug = file.replace(/\.md$/, '');
        const filePath = path.join(dirPath, file);

        // In dev mode, check if file has changed
        if (process.env.NODE_ENV === 'development') {
          const stats = await fs.stat(filePath);
          if (contentStore && contentMeta[filePath] === stats.mtimeMs) {
            return [slug, contentStore[type][slug]] as const;
          }
          contentMeta[filePath] = stats.mtimeMs;
        }

        const content = await parseMarkdown(filePath);
        return [slug, content] as const;
      }),
  );

  return Object.fromEntries(contents);
}

async function loadAllContent(): Promise<ContentStore> {
  const contentTypes: ContentType[] = ['docs', 'news'];
  const contents = await Promise.all(
    contentTypes.map(
      async (type) => [type, await loadContentType(type)] as const,
    ),
  );

  return Object.fromEntries(contents);
}

// Initialize or get content store
async function getStore(): Promise<ContentStore> {
  if (!contentStore) {
    contentStore = await loadAllContent();
  }
  return contentStore;
}

// Public API
export async function getContentByType(type: ContentType) {
  const store = await getStore();
  return store[type] || {};
}

export async function getContentBySlug(type: ContentType, slug: string) {
  const store = await getStore();
  return store[type]?.[slug];
}

// For development: reset content store on module reload
if (process.env.NODE_ENV === 'development') {
  contentStore = null;
}
