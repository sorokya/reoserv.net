import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { GitFeed } from '../components/git-feed';
import { Release } from '../components/release';
import { News } from '../components/news';
import etag from '../utils/etag.server';
import { getGitFeed } from '../utils/get-git-feed.server';
import { getNewsFeed } from '../utils/get-news-feed.server';
import { getLatestRelease } from '../utils/get-latest-release.server';
import { FcDownload } from 'react-icons/fc';
import { PiScrollLight } from 'react-icons/pi';

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
    const release = await getLatestRelease(request);
    const articles = await getNewsFeed(request);
    const body = JSON.stringify({ commits, articles, release });
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
  const { commits, articles, release } = useLoaderData();

  return (
    <Layout commits={commits} release={release}>
      <header>
        <h1 className="mb-1 font-bold text-2xl text-amber-12">Latest News</h1>
        <hr className="border-sand-8" />
      </header>
      <News articles={articles} />
    </Layout>
  );
}

export function Layout({ children, commits, release }) {
  return (
    <div className="grid grid-cols-12 gap-16">
      <div className="col-span-12 space-y-6 lg:col-span-7">{children}</div>

      <div className="col-span-12 self-start lg:col-span-5">
        <div className="border border-amber-6 bg-amber-2 p-6 mb-2">
          <h2 className="font-bold text-amber-12 text-xl flex w-full items-center gap-1">
            <span>
              <FcDownload />
            </span>
            <span>Latest release</span>
          </h2>
          <Release release={release} />
        </div>

        <div className="border border-amber-6 bg-amber-2 p-6">
          <h2 className="font-bold text-amber-12 text-xl flex w-full items-center gap-1">
            <span>
              <PiScrollLight />
            </span>
            <span>Recent changes</span>
          </h2>
          <GitFeed commits={commits} />
        </div>
      </div>
    </div>
  );
}
