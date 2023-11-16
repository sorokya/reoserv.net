import { Links, LiveReload, Meta, Outlet, Scripts } from '@remix-run/react';

import styles from './tailwind.css';

import Header from './components/Header';

export const links = () => [{ rel: 'stylesheet', href: styles }];

export default function App() {
  return (
    <html>
      <head>
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <Meta />
        <Links />
      </head>
      <body className="w-10/12 m-auto">
        <Header />

        <Outlet />

        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
