import { Link } from '@remix-run/react';
import { PiScrollLight } from 'react-icons/pi';

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
    <div className="space-y-4 border border-amber-6 bg-amber-2 p-4 lg:p-6">
      <h2 className="flex w-full items-center gap-1 font-bold text-amber-12 text-xl">
        <span>
          <PiScrollLight />
        </span>
        <span>Recent changes</span>
      </h2>
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
      </ul>{' '}
    </div>
  );
}

export { GitFeed };
