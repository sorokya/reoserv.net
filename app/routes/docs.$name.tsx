import { invariant } from '@epic-web/invariant';
import { NavLink, data, redirect } from 'react-router';
import { getDocsPage } from '~/.server/get-docs-page';
import { ProseContainer } from '~/components/prose-container';
import type { Route } from './+types/docs.$name';

export async function loader({ params }: Route.LoaderArgs) {
  invariant(params.name, 'name is required');

  const page = await getDocsPage(params.name);

  if (!page) {
    throw redirect('/404');
  }

  return data(
    { page },
    {
      status: 200,
      headers: {
        'Cache-Control': 'max-age=3600, public',
        ETag: page.etag,
      },
    },
  );
}

const DOCS_NAV_LINKS = [
  {
    section: 'Getting Started',
    items: [
      { title: 'Installation', link: '/docs/installation' },
      { title: 'Database', link: '/docs/database' },
      { title: 'Configuration', link: '/docs/configuration' },
    ],
  },
  {
    section: 'Data',
    items: [
      { title: 'Arenas', link: '/docs/arenas' },
      { title: 'Commands', link: '/docs/commands' },
      { title: 'Packet Rate Limits', link: '/docs/packet-rate-limits' },
      { title: 'Formulas', link: '/docs/formulas' },
      { title: 'Pub files', link: '/docs/pubs' },
      { title: 'Maps', link: '/docs/maps' },
      { title: 'Quests', link: '/docs/quests' },
      { title: 'News', link: '/docs/news' },
    ],
  },
] as const;

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

export default function Docs({ loaderData }: Route.ComponentProps) {
  const { page } = loaderData;
  const { title, content, description } = page;

  return (
    <>
      <title>{`${title} | Docs | REOSERV`}</title>
      <meta name="description" content={description} />

      <div className="grid gap-12 md:grid-cols-4">
        <div className="p-1 md:col-span-1 md:py-0">
          <ul className="grid">
            {DOCS_NAV_LINKS.map(({ section, items }) => (
              <>
                <ListHeader key={section} title={section} />
                {items.map(({ title, link }) => (
                  <ListItem key={title} title={title} link={link} />
                ))}
              </>
            ))}
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
    </>
  );
}
