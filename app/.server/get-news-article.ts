import { getContentByKey } from './content';

async function getNewsArticle(slug: string) {
  return await getContentByKey(`news/${slug}`);
}

export { getNewsArticle };
