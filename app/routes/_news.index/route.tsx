import { getNewsFeed } from '~/.server/get-news-feed';
import { getPrettyDate } from '~/.server/utils/pretty-date';
import { News } from '~/components/news';
import type { Route } from './+types/route';

export const meta: Route.MetaFunction = () => [
  { title: 'News | REOSERV' },
  { name: 'description', content: 'The latest news from the reoserv project' },
];

export async function loader() {
  const articles = await getNewsFeed();

  return {
    articles: articles.map((article) => ({
      ...article,
      localDate: getPrettyDate(article.date),
    })),
  };
}

export default function Component({ loaderData }: Route.ComponentProps) {
  const { articles } = loaderData;

  return <News articles={articles} />;
}
