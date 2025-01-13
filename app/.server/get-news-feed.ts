import { getContentByType } from './content';

async function getNewsFeed() {
  const articles = await getContentByType('news');

  return Object.entries(articles)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, article]) => ({
      key,
      title: article.title,
      description: article.description,
      date: article.date,
    }));
}

export { getNewsFeed };
