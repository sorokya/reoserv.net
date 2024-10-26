import { parseMarkdown } from './utils/parse-markdown';

const NEWS_PATH = 'content/news';

async function getNewsArticle(name: string, request: Request) {
  const file = `${NEWS_PATH}/${name}.md`;
  return await parseMarkdown(file);
}

export { getNewsArticle };
