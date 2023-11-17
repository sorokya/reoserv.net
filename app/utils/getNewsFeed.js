import matter from 'gray-matter';

import fs from 'fs/promises';
import getPrettyDate from './getPrettyDate';

const NEWS_PATH = 'news';
const DATA_FILE_PATH = 'news-feed.json';
const MAX_FILE_AGE = 5 * 60 * 1000; // 5 minutes in milliseconds

export default async function getNewsFeed(request) {
  const files = await fs.readdir(NEWS_PATH);
  if (!files) {
    return [];
  }

  files.sort((a, b) => b.localeCompare(a));

  const newsItems = await Promise.all(
    files.map((file) =>
      getNewsFile(`${NEWS_PATH}/${file}`, file.substring(0, file.length - 3)),
    ),
  );
  return newsItems;
}

async function getNewsFile(path, name) {
  const file = await fs.open(path, 'r');
  const content = await file.readFile('utf-8');

  const fm = matter(content);
  await file.close();
  return {
    title: fm.data.title,
    name,
    description: fm.data.description,
    date: getPrettyDate(fm.data.date),
  };
}
