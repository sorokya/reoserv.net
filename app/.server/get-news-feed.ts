import { getContentByType } from './content';

async function getNewsFeed() {
  const articles = await getContentByType('news');

  return Object.entries(articles)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([name, article]) => ({
      title: article.title,
      name,
      description: article.description,
      date: article.date,
    }));
}

export { getNewsFeed };
