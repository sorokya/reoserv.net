import { parseMarkdown } from './utils/parse-markdown';

const DOCS_PATH = 'content/docs';

async function getDocsPage(name: string) {
  const file = `${DOCS_PATH}/${name}.md`;
  return await parseMarkdown(file);
}

export { getDocsPage };
