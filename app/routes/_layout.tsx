import type { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { getGitFeed } from '~/.server/get-git-feed';
import { getLatestRelease } from '~/.server/get-latest-release';
import { GitFeed } from '~/components/git-feed';
import { Release } from '~/components/release';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const commits = await getGitFeed();
    const release = await getLatestRelease();

    return { commits, release };
  } catch (e) {
    console.error(e);
    throw new Error('There was an error getting the articles / commit feed');
  }
}

export default function Component() {
  const { commits, release } = useLoaderData<typeof loader>();

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="space-y-6 lg:col-span-7">
        <header>
          <h1 className="mb-1 font-bold text-2xl text-amber-12">Latest News</h1>
          <hr className="border-sand-8" />
        </header>
        <Outlet />
      </div>
      <hr className="border-sand-8 lg:hidden" />
      <div className="grid gap-4 self-start lg:col-span-5">
        {release ?<Release release={release} /> : null}
        <GitFeed commits={commits} />
      </div>
    </div>
  );
}
