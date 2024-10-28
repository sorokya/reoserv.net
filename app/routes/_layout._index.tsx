import { useLoaderData } from '@remix-run/react';
import { getNewsFeed } from '~/.server/get-news-feed';
import { News } from '~/components/news';

export async function loader() {
  try {
    const articles = await getNewsFeed();
    return { articles };
  } catch (e) {
    console.error(e);
    throw new Error('There was an error getting the news feed');
  }
}

export default function Index() {
  const { articles } = useLoaderData<typeof loader>();

  return (
    <>
      <title>Home | REOSERV</title>

      <News articles={articles} />
    </>
  );
}
