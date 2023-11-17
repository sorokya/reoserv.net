import { Link } from '@remix-run/react';

export default function GitFeed({ commits }) {
  return (
    <>
      <h1 className="text-2xl font-bold">Recent Changes</h1>
      <hr className="border-gray-400" />
      <ul>
        {commits.map(
          ({ id, link, content, timestamp }) => (
            <li key={id} className="my-2">
              <Link to={link} className="text-gray-400">
                {timestamp}:{' '}
                <p className="font-mono text-sm text-black">{content}</p>
              </Link>
            </li>
          ),
          [],
        )}
      </ul>
    </>
  );
}
