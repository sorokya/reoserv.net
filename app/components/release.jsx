import { Link } from '@remix-run/react';

export function Release({ release }) {
  return (
    <>
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
    </>
  );
}
