import type { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { getGitFeed } from '~/.server/get-git-feed';
import { getLatestRelease } from '~/.server/get-latest-release';
import { GitFeed } from '~/components/git-feed';
import { Release } from '~/components/release';
import { Layout } from './_index';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const commits = await getGitFeed(request);
    const release = await getLatestRelease(request);

    return { commits, release };
  } catch (e) {
    console.error('There was an error getting the articles / commit feed', e);
    return { commits: [], release: null };
  }
}

export default function FourOFour() {
  const { commits, release } = useLoaderData<typeof loader>();

  return (
    <>
      <title>404 - Page not found | REOSERV</title>

      <Layout
        commits={<GitFeed commits={commits} />}
        release={release ? <Release release={release} /> : null}
      >
        <h1 className="mb-1 font-bold text-3xl">404 - Page not found</h1>
        <p>
          Click
          <Link to="/" className="text-blue-500 underline">
            here
          </Link>
          to go home.
        </p>
      </Layout>
    </>
  );
}
