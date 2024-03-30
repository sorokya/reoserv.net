import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import GitFeed from '../components/GitFeed';
import getGitFeed from '../utils/getGitFeed';
import etag from './etag.server';

export const headers = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control'),
  ETag: loaderHeaders.get('ETag'),
});

export function meta() {
  return [{ title: 'Not Found | REOSERV' }];
}

export async function loader({ request }) {
  try {
    const commits = await getGitFeed(request);
    const body = JSON.stringify({ commits });
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

export default function FourOFour() {
  const { commits } = useLoaderData();

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <div className="col-span-2">
        <h1 className="mb-1 font-bold text-3xl">404 - Page not found</h1>
        <p>
          Click{' '}
          <Link to="/" className="text-blue-500 underline">
            here
          </Link>{' '}
          to go home.
        </p>
      </div>
      <div className="col-span-1">
        <GitFeed commits={commits} />
      </div>
    </div>
  );
}
