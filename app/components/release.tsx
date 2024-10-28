import { Link } from '@remix-run/react';
import { FcDownload } from 'react-icons/fc';

type ReleaseProps = {
  release: {
    timestamp: string;
    link: string;
    name: string;
  };
};

function Release({ release }: ReleaseProps) {
  return (
    <div className="space-y-2 border border-amber-6 bg-amber-2 p-4 lg:p-6">
      <h2 className="flex w-full items-center gap-1 font-bold text-amber-12 text-xl">
        <span>
          <FcDownload />
        </span>
        <span>Latest release</span>
      </h2>
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
    </div>
  );
}

export { Release };
