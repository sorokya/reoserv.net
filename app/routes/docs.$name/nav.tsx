import { NavLink as RouterNavLink } from 'react-router';

const LINKS = [
  {
    section: 'Getting Started',
    items: [
      { title: 'Quick Start', link: '/docs/quick-start' },
      { title: 'Quick Start (spanish)', link: '/docs/quick-start-es' },
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

function Nav() {
  return (
    <ul className="grid">
      {LINKS.map(({ section, items }) => (
        <>
          <NavGroupHeader key={section} title={section} />
          {items.map(({ title, link }) => (
            <NavLink key={title} title={title} link={link} />
          ))}
        </>
      ))}
    </ul>
  );
}

function NavGroupHeader({ title }: { title: string }) {
  return (
    <li className="pt-6 pb-3 font-bold text-lg text-sand-12 first:pt-0">
      {title}
    </li>
  );
}

function NavLink({ title, link }: { title: string; link: string }) {
  return (
    <li>
      <RouterNavLink
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
      </RouterNavLink>
    </li>
  );
}

export { Nav };
