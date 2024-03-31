import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { GitFeed } from '../components/GitFeed';
import { News } from '../components/News';
import etag from '../utils/etag.server';
import { getGitFeed } from '../utils/getGitFeed.server';
import { getNewsFeed } from '../utils/getNewsFeed.server';

export const headers = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control'),
  ETag: loaderHeaders.get('ETag'),
});

export function meta() {
  return [{ title: 'Home | REOSERV' }];
}

export async function loader({ request }) {
  try {
    const commits = await getGitFeed(request);
    const articles = await getNewsFeed(request);
    const body = JSON.stringify({ commits, articles });
    const ETag = etag(body);

    return new Response(body, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=60, public',
        ETag,
      },
    });
  } catch (e) {
    console.error('There was an error getting the articles / commit feed', e);
    return json([]);
  }
}

export default function Index() {
  const { commits, articles } = useLoaderData();

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <div className="col-span-2">
        <News articles={articles} />
      </div>
      <div className="col-span-1">
        <GitFeed commits={commits} />
      </div>
    </div>
  );
}
