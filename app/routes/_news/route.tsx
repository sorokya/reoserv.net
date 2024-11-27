import { Outlet } from 'react-router';
import { getGitFeed } from '~/.server/get-git-feed';
import { getLatestRelease } from '~/.server/get-latest-release';
import { GitFeed } from '~/components/git-feed';
import { Release } from '~/components/release';
import type { Route } from './+types/route';

export async function loader() {
  const commits = await getGitFeed();
  const release = await getLatestRelease();

  return { commits, release };
}

export default function Component({ loaderData }: Route.ComponentProps) {
  const { commits, release } = loaderData;

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="space-y-6 lg:col-span-8">
        <header>
          <h1 className="mb-1 font-bold text-2xl text-amber-12">Latest News</h1>
          <hr className="border-sand-8" />
        </header>
        <Outlet />
      </div>
      <hr className="border-sand-8 lg:hidden" />
      <div className="grid gap-4 self-start lg:col-span-4">
        <Release release={release} />
        <GitFeed commits={commits} />
      </div>
    </div>
  );
}
