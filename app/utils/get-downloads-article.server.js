import { getClockOffset } from './get-clock-offset.server';
import { parseMarkdown } from './parse-markdown';

const DOWNLOADS_PATH = 'content';

async function getDownloadsArticle(request) {
  const clockOffset = getClockOffset(request);
  const file = `${DOWNLOADS_PATH}/downloads.md`;
  return await parseMarkdown(file, { clockOffset });
}

export { getDownloadsArticle };
