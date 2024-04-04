import fs from 'node:fs/promises';
import matter from 'gray-matter';
import { Marked } from 'marked';
import markedShiki from 'marked-shiki';
import { getHighlighter } from 'shiki';
import etag from './etag.server';
import { getPrettyDate } from './get-pretty-date.server';
import { replaceVideoTags } from './replace-video-tags.server';

const highlighter = getHighlighter({
  langs: ['md', 'sh', 'bash', 'rust', 'plaintext', 'yaml'],
  themes: ['github-dark-dimmed'],
});

async function parseMarkdown(filepath, { clockOffset } = { clockOffset: 0 }) {
  const contents = await fs.readFile(filepath, { encoding: 'utf-8' });

  const fm = matter(contents);

  const markdown = await new Marked()
    .use({ async: true, gfm: true })
    .use(
      markedShiki({
        async highlight(code, lang) {
          return (await highlighter).codeToHtml(code, {
            lang: lang || 'plaintext',
            theme: 'github-dark-dimmed',
          });
        },
      }),
    )
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
