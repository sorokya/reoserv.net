import fs from 'node:fs/promises';
import frontmatter from 'gray-matter';
import { Marked } from 'marked';
import { createHighlighter } from 'shiki';
import { etag } from './etag';

let highlighter;

async function parseMarkdown(filepath) {
  if (!highlighter) {
    highlighter = await createHighlighter({
      langs: ['md', 'sh', 'rust', 'text', 'yaml'],
      themes: ['github-dark-dimmed'],
    });
  }

  const fileContents = await fs.readFile(filepath, { encoding: 'utf-8' });

  const fm = frontmatter(fileContents);

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

  const content = replaceVideoTags(markdown);

  return {
    title: fm.data.title,
    description: fm.data.description,
    date: fm.data.date ?? null,
    lastmod: fm.data.lastmod ?? null,
    etag: etag(content),
    content,
  };
}

function replaceVideoTags(html) {
  while (html.includes('{{<video')) {
    const start = html.indexOf('{{<video');
    const end = html.indexOf('}}', start);
    const videoTag = html.substring(start, end + 2);

    const src = videoTag.match(/src="([^"]+)"/)[1];
    // biome-ignore lint/style/noParameterAssign:
    html = html.replace(
      videoTag,
      `<video controls><source src="${src}" type="video/mp4">Your browser does not support video</video>`,
    );
  }

  return html;
}

export { parseMarkdown };
