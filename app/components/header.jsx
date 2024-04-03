import { Link } from '@remix-run/react';
import { FaGithub } from 'react-icons/fa6';
import { FcDocument, FcDownload, FcHome, FcList } from 'react-icons/fc';
import logo from '../assets/images/logo-full.png?as=metadata';

export function Header() {
  const links = [
    { href: '/', label: 'Home', icon: <FcHome /> },
    {
      href: '/docs/installation',
      label: 'Docs',
      icon: <FcDocument />,
    },
    {
      href: '/downloads',
      label: 'Downloads',
      icon: <FcDownload />,
    },
    {
      href: 'https://github.com/sorokya/reoserv',
      label: 'GitHub',
      icon: <FaGithub />,
    },
    {
      href: 'http://apollo-games.com/sln/sln.php',
      label: 'SLN',
      icon: <FcList />,
    },
  ];

  return (
    <header className="relative flex-0 space-y-2 py-4">
      <div className="flex justify-between">
        <img
          loading="preload"
          src={logo.src}
          alt="Reoserv"
          className="inline-block h-12 max-w-full object-contain object-left"
          height={logo.height}
          width={logo.width}
        />
        <em className="text-gray-11 text-sm italic">
          The{' '}
          <Link
            to="https://www.rust-lang.org/"
            className="font-bold hover:text-accent-11 hover:underline"
          >
            rust
          </Link>{' '}
          powered Endless Online server emulator
        </em>
      </div>
      <nav>
        <ul className="text-center md:text-left">
          {links.map(({ href, label, icon }) => (
            <li key={href} className="mb-2 md:mr-3 md:mb-0 md:inline-block">
              <Link
                to={href}
                className="flex w-full items-center gap-1 rounded-sm border border-accent-8 bg-accent-2 px-2 text-accent-12 hover:bg-accent-3 hover:text-accent-11"
                prefetch="intent"
              >
                <span className="text-[0.9em]">{icon}</span>
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <hr className="mt-2 border-gray-8" />
    </header>
  );
}
