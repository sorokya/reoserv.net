import { Form, Link, NavLink } from '@remix-run/react';
import { FaGithub } from 'react-icons/fa6';
import { FcDocument, FcHome, FcList } from 'react-icons/fc';
import { LuMoon, LuSun } from 'react-icons/lu';
import { SiKofi } from 'react-icons/si';
import logo from '../assets/images/logo-full.png?as=metadata';

const getLinkClasses = (active = false) =>
  `flex w-full items-center gap-1 rounded-sm border px-2 ${
    active
      ? 'bg-amber-4 text-amber-11 font-bold border-amber-11 hover:bg-amber-3 hover:text-amber-11'
      : 'bg-amber-2 text-amber-12 border-amber-8 hover:bg-amber-3 hover:text-amber-11'
  }`;

export function Header({ theme }) {
  const links = [
    { href: '/', label: 'Home', icon: <FcHome /> },
    {
      href: '/docs',
      label: 'Docs',
      icon: <FcDocument />,
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
    {
      href: 'https://ko-fi.com/sorokya',
      label: 'Support Me on Ko-fi',
      icon: <SiKofi />,
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
        <em className="text-sand-11 text-sm italic">
          The{' '}
          <Link
            to="https://www.rust-lang.org/"
            className="font-bold hover:text-amber-11 hover:underline"
          >
            rust
          </Link>{' '}
          powered Endless Online server emulator
        </em>
      </div>
      <nav>
        <ul className="flex flex-wrap gap-3 text-center md:text-left">
          {links.map(({ href, label, icon }) => (
            <li key={href} className="inline-block">
              <NavLink
                to={href}
                className={({ isActive }) => getLinkClasses(isActive)}
                prefetch="intent"
                target={href.indexOf('http') === 0 ? '_blank' : ''}
              >
                <span className="text-[0.9em]">{icon}</span>
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
          <li className="inline-block">
            <Form action="/theme" method="post">
              <button type="submit" className={getLinkClasses()}>
                <span className="text-[0.9em]">
                  {theme === 'light' ? <LuSun /> : <LuMoon />}
                </span>
                <span>Toggle theme</span>
              </button>
            </Form>
          </li>
        </ul>
      </nav>
      <hr className="border-amber-8" />
    </header>
  );
}
