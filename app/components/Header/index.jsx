import { Link } from '@remix-run/react';
import logo from './logo.png';

export default function Header() {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/downloads', label: 'Downloads' },
    { href: 'https://github.com/sorokya/reoserv', label: 'GitHub' },
  ];

  return (
    <header className="mt-1 lg:relative">
      <h1 className="md:inline-block md:mr-4 text-4xl">
        <img src={logo} alt="Reoserv" className="w-8 h-8 inline-block mb-1" />
        REOSERV
      </h1>
      <span className="text-gray-400 sm:mb-1 md:hidden lg:inline lg:right-0 lg:top-2 md:absolute">
        The{' '}
        <Link to="https://www.rust-lang.org/" className="font-bold">
          rust
        </Link>{' '}
        powered Endless Online server emulator
      </span>
      <ul className="md:inline-block text-center">
        {links.map(
          ({ href, label }) => (
            <li className="md:inline-block md:mr-3 hover:underline">
              <Link to={href} className="block w-full">
                {label}
              </Link>
            </li>
          ),
          [],
        )}
      </ul>

      <hr className="mt-1 border-gray-400" />
    </header>
  );
}
