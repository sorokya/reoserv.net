import { getContentByKey } from './content';

async function getDocsPage(slug: string) {
  return await getContentByKey(`docs/${slug}`);
}

export { getDocsPage };
