import { Link } from '@remix-run/react';

export function GitFeed({ commits }) {
  return (
    <ul className="grid gap-4">
      {commits.map(({ id, link, content, timestamp }) => (
        <li key={id} className="grid">
          <span className="text-gray-11 text-xs">{timestamp}</span>
          <Link
            to={link}
            className="text-gray-12 transition hover:font-medium hover:text-accent-11"
          >
            <span title={content} className="line-clamp-1 text-sm">
              {content}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
