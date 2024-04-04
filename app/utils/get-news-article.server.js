import { getClockOffset } from './get-clock-offset.server';
import { parseMarkdown } from './parse-markdown';

const NEWS_PATH = 'content/news';

async function getNewsArticle(name, request) {
  const clockOffset = getClockOffset(request);
  const file = `${NEWS_PATH}/${name}.md`;
  return await parseMarkdown(file, { clockOffset });
}

export { getNewsArticle };
