import fs from 'node:fs/promises';
import matter from 'gray-matter';
import { Marked } from 'marked';
import { createHighlighter } from 'shiki';
import etag from './etag';
import { getPrettyDate } from './get-pretty-date';
import { replaceVideoTags } from './replace-video-tags';

let highlighter;

async function parseMarkdown(filepath, { clockOffset } = { clockOffset: 0 }) {
  if (!highlighter) {
    highlighter = await createHighlighter({
      langs: ['md', 'sh', 'rust', 'text', 'yaml'],
      themes: ['github-dark-dimmed'],
    });
  }

  const contents = await fs.readFile(filepath, { encoding: 'utf-8' });

  const fm = matter(contents);

  const markdown = await new Marked()
    .use({ async: true, gfm: true })
    .use({
      renderer: {
        code(code) {
          return highlighter.codeToHtml(code.text, {
            lang: code.lang ?? 'text',
            theme: 'github-dark-dimmed',
          });
        },
      },
    })
    .parse(fm.content);

  return {
    title: fm.data.title,
    description: fm.data.description,
    date: fm.data.date ? getPrettyDate(fm.data.date, clockOffset) : null,
    lastmod: fm.data.lastmod
      ? getPrettyDate(fm.data.lastmod, clockOffset)
      : null,
    etag: etag(markdown),
    content: replaceVideoTags(markdown),
  };
}

export { parseMarkdown };
