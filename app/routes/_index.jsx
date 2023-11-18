import etag from './etag.server';
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import News from '../components/News';
import GitFeed from '../components/GitFeed';
import getGitFeed from '../utils/getGitFeed';
import getNewsFeed from '../utils/getNewsFeed';

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
    console.log('etag', ETag);

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
