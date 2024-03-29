import etag from './etag.server';
import matter from 'gray-matter';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

import hljs from 'highlight.js';

import fs from 'fs/promises';

const DOCS_PATH = 'docs';

export default async function getDocsPage(name) {
  const file = await fs.open(`${DOCS_PATH}/${name}.md`, 'r');
  const content = await file.readFile('utf-8');
  await file.close();

  const marked = new Marked(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
    }),
  );

  const fm = matter(content);
  const markdown = `${fm.data.description}\n${fm.content}`;
  return {
    title: fm.data.title,
    description: fm.data.description,
    etag: etag(markdown),
    content: replaceVideoTags(marked.parse(markdown)),
  };
}

function replaceVideoTags(html) {
  while (html.includes('{{<video')) {
    const start = html.indexOf('{{<video');
    const end = html.indexOf('}}', start);
    const videoTag = html.substring(start, end + 2);

    const src = videoTag.match(/src="([^"]+)"/)[1];
    html = html.replace(
      videoTag,
      `<video controls><source src="${src}" type="video/mp4">Your browser does not support video</video>`,
    );
  }

  return html;
}
