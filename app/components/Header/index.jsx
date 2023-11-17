import { Link } from '@remix-run/react';
import { FcAbout, FcDownload, FcHome, FcList } from 'react-icons/fc/index.js';
import { FaGithub } from 'react-icons/fa/index.js';
import logo from './reoserv-small.png';

export default function Header() {
  const links = [
    { href: '/', label: 'Home', icon: <FcHome className="inline mb-1 mr-1" /> },
    {
      href: '/about',
      label: 'About',
      icon: <FcAbout className="inline mb-1 mr-1" />,
    },
    {
      href: '/downloads',
      label: 'Downloads',
      icon: <FcDownload className="inline mb-1 mr-1" />,
    },
    {
      href: 'https://github.com/sorokya/reoserv',
      label: 'GitHub',
      icon: <FaGithub className="inline mb-1 mr-1" />,
    },
    {
      href: 'http://apollo-games.com/sln/sln.php',
      label: 'SLN',
      icon: <FcList className="inline mb-1 mr-1" />,
    },
  ];

  return (
    <header className="mt-1 mb-4 md:relative">
      <h1
        className="md:inline-block md:mr-4 text-4xl font-mono text-amber-800 mb-1"
        style={{ textShadow: '#000 1px 0' }}
      >
        <img src={logo} alt="Reoserv" className="inline-block mb-1" />
      </h1>
      <span className="text-gray-400 inline md:text-sm md:block md:right-0 md:top-2 md:absolute italic">
        The{' '}
        <Link to="https://www.rust-lang.org/" className="font-bold">
          rust
        </Link>{' '}
        powered Endless Online server emulator
      </span>
      <ul className="text-center md:text-left">
        {links.map(
          ({ href, label, icon }) => (
            <li key={href} className="md:inline-block mb-2 md:mb-0 md:mr-3">
              <Link
                to={href}
                className="block w-full border border-amber-600 px-2 rounded-sm bg-amber-100 text-amber-600 hover:bg-amber-600 hover:text-amber-100"
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
