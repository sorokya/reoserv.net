import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import News from '../components/News';
import GitFeed from '../components/GitFeed';
import getGitFeed from '../utils/getGitFeed';
import getNewsFeed from '../utils/getNewsFeed';

export function meta() {
  return [{ title: 'Home | REOSERV' }];
}

export async function loader({ request }) {
  try {
    const commits = await getGitFeed(request);
    const articles = await getNewsFeed(request);
    return json({
      commits,
      articles,
    });
  } catch (e) {
    console.error('There was an error getting the commit feed', e);
    return json([]);
  }
}

export default function Index() {
  const { commits, articles } = useLoaderData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <div className="col-span-2">
        <News articles={articles} />
      </div>
      <div className="col-span-1">
        <GitFeed commits={commits} />
      </div>
    </div>
  );
}
