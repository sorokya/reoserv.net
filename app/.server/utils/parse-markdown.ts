import fs from 'node:fs/promises';
import frontmatter from 'gray-matter';
import { Marked } from 'marked';
import { type Highlighter, createHighlighter } from 'shiki';
import { etag } from './etag';

let highlighter: Highlighter;
let marked: Marked;

async function parseMarkdown(filepath: string) {
  if (!highlighter) {
    highlighter = await createHighlighter({
      langs: ['md', 'sh', 'rust', 'text', 'yaml'],
      themes: ['github-dark-dimmed'],
    });
  }

  if (!marked) {
    marked = new Marked().use({ async: true, gfm: true }).use({
      renderer: {
        code(code) {
          return highlighter.codeToHtml(code.text, {
            lang: code.lang ?? 'text',
            theme: 'github-dark-dimmed',
          });
        },
      },
    });
  }

  const fileContents = await fs.readFile(filepath, { encoding: 'utf-8' });

  const fm = frontmatter(fileContents);

  const html = await marked.parse(fm.content);

  const content = replaceVideoTags(html);

  return {
    title: fm.data.title,
    description: fm.data.description,
    date: new Date(fm.data.date).toISOString(),
    lastmod: new Date(fm.data.lastmod).toISOString(),
    etag: etag(content),
    content,
  };
}

function replaceVideoTags(html: string) {
  while (html.includes('{{<video')) {
    const start = html.indexOf('{{<video');
    const end = html.indexOf('}}', start);
    const videoTag = html.substring(start, end + 2);

    const matches = videoTag.match(/src="([^"]+)"/);
    if (matches) {
      const src = matches[1];
      // biome-ignore lint/style/noParameterAssign:
      html = html.replace(
        videoTag,
        `<video controls><source src="${src}" type="video/mp4">Your browser does not support video</video>`,
      );
    }
  }

  return html;
}

export { parseMarkdown };
