import { Link, useLocation, useLoaderData } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import getDocsPage from '../utils/getDocsPage';

import styles from '../news.css';
import codeStyles from 'highlight.js/styles/github.min.css';

export const headers = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control'),
  ETag: loaderHeaders.get('ETag'),
});

export const links = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: codeStyles },
];

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
  { type: 'header', title: 'Configuration' },
  { type: 'item', title: 'Server', link: '/docs/server' },
  { type: 'item', title: 'Arenas', link: '/docs/arenas' },
  { type: 'item', title: 'Commands', link: '/docs/commands' },
  {
    type: 'item',
    title: 'Packet Rate Limits',
    link: '/docs/packet-rate-limits',
  },
  { type: 'item', title: 'Formulas', link: '/docs/formulas' },
  { type: 'header', title: 'Data' },
  { type: 'item', title: 'Pub files', link: '/docs/pubs' },
  { type: 'item', title: 'Maps', link: '/docs/maps' },
  { type: 'item', title: 'Quests', link: '/docs/quests' },
  { type: 'item', title: 'News', link: '/docs/news' },
];

function ListHeader({ title }) {
  return <li className="text-lg font-bold">{title}</li>;
}

function ListItem({ title, link, active = false }) {
  return (
    <li
      className={`border-l-2 pl-3 border-l-amber-${
        active ? '300' : '100'
      } hover:border-l-amber-400 ${active ? 'text-amber-300' : ''}`}
    >
      <Link to={link}>{title}</Link>
    </li>
  );
}

export default function Docs() {
  const { pathname } = useLocation();
  const { page } = useLoaderData();
  const { title, content } = page;

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-6">
      <div className="p-1 md:col-span-1">
        <ul>
          {LIST.map(({ type, title, link }) => {
            if (type === 'header') {
              return <ListHeader key={title} title={title} />;
            } else {
              return (
                <ListItem
                  key={title}
                  title={title}
                  link={link}
                  active={link == pathname}
                />
              );
            }
          })}
        </ul>
      </div>
      <div className="p-1 md:col-span-5">
        <h1 className="text-3xl mb-2 font-bold">{title}</h1>
        <div id="article" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}
