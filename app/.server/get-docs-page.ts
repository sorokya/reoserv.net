import { getContentBySlug } from './content';

async function getDocsPage(name: string) {
  return await getContentBySlug('docs', name);
}

export { getDocsPage };
