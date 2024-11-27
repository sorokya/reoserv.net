import { FcDownload } from 'react-icons/fc';
import { Link } from 'react-router';

type ReleaseProps = {
  release: {
    localDate: string;
    timestamp: string;
    link: string;
    name: string;
  };
};

function Release({ release }: ReleaseProps) {
  return (
    <div className="space-y-2 border border-amber-6 bg-amber-2 p-4">
      <h2 className="flex w-full items-center gap-1 font-bold text-amber-12 text-xl">
        <span>
          <FcDownload />
        </span>
        <span>Latest release</span>
      </h2>
      <div>
        <time dateTime={release.timestamp} className="text-sand-11 text-xs">
          {release.localDate}
        </time>
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
