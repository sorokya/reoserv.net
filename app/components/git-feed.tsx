import { PiScrollLight } from 'react-icons/pi';
import { Link } from 'react-router';

type GitFeedProps = {
  commits: Array<{
    id: string;
    link: string;
    content: string;
    timestamp: string;
    localDate: string;
  }>;
};

function GitFeed({ commits }: GitFeedProps) {
  return (
    <div className="space-y-4 border border-amber-6 bg-amber-2 p-4">
      <h2 className="flex w-full items-center gap-1 font-bold text-amber-12 text-xl">
        <span>
          <PiScrollLight />
        </span>
        <span>Recent changes</span>
      </h2>
      <ul className="grid gap-4">
        {commits.map((commit) => (
          <li key={commit.id} className="grid">
            <time dateTime={commit.timestamp} className="text-sand-11 text-xs">
              {commit.localDate}
            </time>
            <Link
              to={commit.link}
              target="_blank"
              className="text-sand-12 transition hover:font-medium hover:text-amber-11"
            >
              <span title={commit.content} className="line-clamp-1 text-sm">
                {commit.content}
              </span>
            </Link>
          </li>
        ))}
      </ul>{' '}
    </div>
  );
}

export { GitFeed };
