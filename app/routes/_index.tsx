import {
  type HeadersFunction,
  type LoaderFunctionArgs,
  json,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { FcDownload } from 'react-icons/fc';
import { PiScrollLight } from 'react-icons/pi';
import etag from '../.server/etag';
import { getGitFeed } from '../.server/get-git-feed';
import { getLatestRelease } from '../.server/get-latest-release';
import { getNewsFeed } from '../.server/get-news-feed';
import { GitFeed } from '../components/git-feed';
import { News } from '../components/news';
import { Release } from '../components/release';

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control') ?? '',
  ETag: loaderHeaders.get('ETag') ?? '',
});

export function meta() {
  return [{ title: 'Home | REOSERV' }];
}

export async function loader({ request }: LoaderFunctionArgs) {
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
  const { commits, articles, release } = useLoaderData<typeof loader>();

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

export function Layout({
  children,
  commits,
  release,
}: {
  children: React.ReactNode;
  commits: Awaited<ReturnType<typeof getGitFeed>>;
  release: Awaited<ReturnType<typeof getLatestRelease>>;
}) {
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="space-y-6 lg:col-span-7">{children}</div>

      <hr className="border-sand-8 lg:hidden" />

      <div className="grid gap-4 self-start lg:col-span-5">
        <div className="space-y-2 border border-amber-6 bg-amber-2 p-4 lg:p-6">
          <h2 className="flex w-full items-center gap-1 font-bold text-amber-12 text-xl">
            <span>
              <FcDownload />
            </span>
            <span>Latest release</span>
          </h2>
          <Release release={release} />
        </div>

        <div className="space-y-4 border border-amber-6 bg-amber-2 p-4 lg:p-6">
          <h2 className="flex w-full items-center gap-1 font-bold text-amber-12 text-xl">
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
