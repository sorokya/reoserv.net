import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { GitFeed } from '../components/git-feed';
import { News } from '../components/news';
import etag from '../utils/etag.server';
import { getGitFeed } from '../utils/get-git-feed.server';
import { getNewsFeed } from '../utils/get-news-feed.server';

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
    <div className="grid grid-cols-12 gap-16">
      <div className="col-span-12 space-y-6 lg:col-span-7">
        <header>
          <h1 className="mb-1 font-bold text-2xl">Latest News</h1>
          <hr className="border-gray-8" />
        </header>
        <News articles={articles} />
      </div>
      <div className="col-span-12 space-y-4 self-start border border-accent-6 bg-accent-2 p-6 lg:col-span-5">
        <h2 className="font-bold text-xl">Recent changes</h2>
        <GitFeed commits={commits} />
      </div>
    </div>
  );
}
