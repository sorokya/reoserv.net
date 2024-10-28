import { Link } from '@remix-run/react';

type GitFeedProps = {
  commits: Array<{
    id: string;
    link: string;
    content: string;
    timestamp: string;
  }>;
};

function GitFeed({ commits }: GitFeedProps) {
  return (
    <ul className="grid gap-4">
      {commits.map(({ id, link, content, timestamp }) => (
        <li key={id} className="grid">
          <span className="text-sand-11 text-xs">{timestamp}</span>
          <Link
            to={link}
            target="_blank"
            className="text-sand-12 transition hover:font-medium hover:text-amber-11"
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

export { GitFeed };
