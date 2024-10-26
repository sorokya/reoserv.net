import { getClockOffset } from './utils/clock-offset';
import { parseMarkdown } from './utils/parse-markdown';

const NEWS_PATH = 'content/news';

async function getNewsArticle(name: string, request: Request) {
  const clockOffset = getClockOffset(request);
  const file = `${NEWS_PATH}/${name}.md`;
  return await parseMarkdown(file);
}

export { getNewsArticle };
