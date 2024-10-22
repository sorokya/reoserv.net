import {
  type HeadersFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
  redirect,
} from '@remix-run/node';
import { NavLink, useLoaderData } from '@remix-run/react';
import { getDocsPage } from '../.server/get-docs-page';
import { ProseContainer } from '../components/prose-container';

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control') ?? '',
  ETag: loaderHeaders.get('ETag') ?? '',
});

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data.page.title} | Docs | REOSERV` },
    { name: 'description', value: data.page.description },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
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

function ListHeader({ title }: { title: string }) {
  return (
    <li className="pt-6 pb-3 font-bold text-lg text-sand-12 first:pt-0">
      {title}
    </li>
  );
}

function ListItem({ title, link }: { title: string; link: string }) {
  return (
    <li>
      <NavLink
        prefetch="intent"
        className={({ isActive }) =>
          `block border-l-4 py-1 pl-3 transition hover:border-l-amber-6 hover:text-amber-11 ${
            isActive
              ? 'border-l-amber-7 font-bold text-amber-11 tracking-wide'
              : 'border-l-sand-4 text-sand-11'
          }`
        }
        to={link}
      >
        {title}
      </NavLink>
    </li>
  );
}

export default function Docs() {
  const { page } = useLoaderData<typeof loader>();
  const { title, content } = page;

  return (
    <div className="grid gap-12 md:grid-cols-4">
      <div className="p-1 md:col-span-1 md:py-0">
        <ul className="grid">
          {LIST.map(({ type, title, link }) =>
            type === 'header' ? (
              <ListHeader key={title} title={title} />
            ) : (
              <ListItem key={title} title={title} link={link} />
            ),
          )}
        </ul>
      </div>
      <div className="md:col-span-3">
        <ProseContainer>
          <h1>{title}</h1>
          <div
            className="pb-2"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: this markdown content isn't user submitted
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </ProseContainer>
      </div>
    </div>
  );
}
