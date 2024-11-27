import { getNewsFeed } from '~/.server/get-news-feed';
import { News } from '~/components/news';
import type { Route } from './+types/route';

export async function loader() {
  const articles = await getNewsFeed();
  return { articles };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { articles } = loaderData;

  return (
    <>
      <title>Home | REOSERV</title>

      <News articles={articles} />
    </>
  );
}
