import { Link } from '@remix-run/react';
import { FaGithub } from 'react-icons/fa/index.js';
import {
  FcDocument,
  FcDownload,
  FcHome,
  FcList,
} from 'react-icons/fc/index.js';
import logo from './reoserv-small.png';

export function Header() {
  const links = [
    { href: '/', label: 'Home', icon: <FcHome className="mr-1 mb-1 inline" /> },
    {
      href: '/docs/installation',
      label: 'Docs',
      icon: <FcDocument className="mr-1 mb-1 inline" />,
    },
    {
      href: '/downloads',
      label: 'Downloads',
      icon: <FcDownload className="mr-1 mb-1 inline" />,
    },
    {
      href: 'https://github.com/sorokya/reoserv',
      label: 'GitHub',
      icon: <FaGithub className="mr-1 mb-1 inline" />,
    },
    {
      href: 'http://apollo-games.com/sln/sln.php',
      label: 'SLN',
      icon: <FcList className="mr-1 mb-1 inline" />,
    },
  ];

  return (
    <header className="mt-1 mb-4 md:relative">
      <h1
        className="mb-1 font-mono text-4xl text-amber-800 md:mr-4 md:inline-block"
        style={{ textShadow: '#000 1px 0' }}
      >
        <img src={logo} alt="Reoserv" className="mb-1 inline-block" />
      </h1>
      <span className="inline text-gray-400 italic md:absolute md:top-2 md:right-0 md:block md:text-sm">
        The{' '}
        <Link to="https://www.rust-lang.org/" className="font-bold">
          rust
        </Link>{' '}
        powered Endless Online server emulator
      </span>
      <ul className="text-center md:text-left">
        {links.map(
          ({ href, label, icon }) => (
            <li key={href} className="mb-2 md:mr-3 md:mb-0 md:inline-block">
              <Link
                to={href}
                className="block w-full rounded-sm border border-amber-600 bg-amber-100 px-2 text-amber-600 hover:bg-amber-600 hover:text-amber-100"
              >
                {icon}
                {label}
              </Link>
            </li>
          ),
          [],
        )}
      </ul>

      <hr className="mt-2 border-gray-400" />
    </header>
  );
}
