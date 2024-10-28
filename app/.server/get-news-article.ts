import { getContentBySlug } from './content';

async function getNewsArticle(name: string) {
  return await getContentBySlug('news', name);
}

export { getNewsArticle };
