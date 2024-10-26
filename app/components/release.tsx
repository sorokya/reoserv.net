import { Link } from '@remix-run/react';

type ReleaseProps = {
  release: {
    timestamp: string;
    link: string;
    name: string;
  };
};

function Release({ release }: ReleaseProps) {
  return (
    <div>
      <span className="text-sand-11 text-xs">{release.timestamp}</span>
      <Link
        to={release.link}
        target="_blank"
        className="text-sand-12 transition hover:font-medium hover:text-amber-11"
      >
        <span title={release.name} className="line-clamp-1 text-sm">
          {release.name}
        </span>
      </Link>
    </div>
  );
}

export { Release };
