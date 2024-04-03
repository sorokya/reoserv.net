import { redirect } from '@remix-run/node';
import { Link, useLoaderData, useLocation } from '@remix-run/react';
import { getDocsPage } from '../utils/get-docs-page.server';

export const headers = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control'),
  ETag: loaderHeaders.get('ETag'),
});

export function meta({ data }) {
  return [
    { title: `${data.page.title} | Docs | REOSERV` },
    { name: 'description', value: data.page.description },
  ];
}

export async function loader({ params }) {
  try {
    const page = await getDocsPage(params.name);
    return new Response(JSON.stringify({ page }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=3600, public',
        ETag: page.etag,
      },
    });
  } catch (e) {
    console.error('There was an error getting the page', e);
    return redirect('/404');
  }
}

const LIST = [
  { type: 'header', title: 'Getting Started' },
  { type: 'item', title: 'Installation', link: '/docs/installation' },
  { type: 'item', title: 'Database', link: '/docs/database' },
  { type: 'item', title: 'Configuration', link: '/docs/configuration' },
  { type: 'header', title: 'Data' },
  { type: 'item', title: 'Arenas', link: '/docs/arenas' },
  { type: 'item', title: 'Commands', link: '/docs/commands' },
  {
    type: 'item',
    title: 'Packet Rate Limits',
    link: '/docs/packet-rate-limits',
  },
  { type: 'item', title: 'Formulas', link: '/docs/formulas' },
  { type: 'item', title: 'Pub files', link: '/docs/pubs' },
  { type: 'item', title: 'Maps', link: '/docs/maps' },
  { type: 'item', title: 'Quests', link: '/docs/quests' },
  { type: 'item', title: 'News', link: '/docs/news' },
];

function ListHeader({ title }) {
  return (
    <li className="pt-6 pb-3 font-bold text-gray-12/80 text-lg first:pt-0">
      {title}
    </li>
  );
}

function ListItem({ title, link, active = false }) {
  const className = active
    ? 'border-l-accent-7 text-accent-11 font-bold tracking-wide'
    : 'border-l-gray-4 text-gray-11';

  return (
    <li
      // biome-ignore lint/nursery/useSortedClasses: does not interpolate well
      className={`border-l-4 transition hover:border-l-accent-4 hover:text-accent-11/80 ${className}`}
    >
      <Link prefetch="intent" className="block py-1 pl-3" to={link}>
        {title}
      </Link>
    </li>
  );
}

export default function Docs() {
  const { pathname } = useLocation();
  const { page } = useLoaderData();
  const { title, content } = page;

  return (
    <div className="grid md:grid-cols-12">
      <div className="p-1 md:col-span-3">
        <ul className="grid">
          {LIST.map(({ type, title, link }) => {
            if (type === 'header') {
              return <ListHeader key={title} title={title} />;
            }
            return (
              <ListItem
                key={title}
                title={title}
                link={link}
                active={link === pathname}
              />
            );
          })}
        </ul>
      </div>
      <div className="prose prose-sm lg:prose-base p-1 md:col-span-9">
        <h1>{title}</h1>
        <div
          className="pb-2"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: this markdown content isn't user submitted
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
