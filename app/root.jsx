import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

import styles from './tailwind.css';

import Header from './components/Header';

export const links = () => [{ rel: 'stylesheet', href: styles }];

export default function App() {
  return (
    <html style={{ background: "url('/back.jpg')" }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="keywords"
          content="reoserv,rust,game,server,endless,online,eo,async,tokio"
        />
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <link rel="icon" type="image/png" href="/favicon-32.png" />
        <Meta />
        <Links />
      </head>
      <body className="w-5/6 xl:w-3/5 min-h-screen mx-auto border-x border-2 px-4 bg-gray-50">
        <Header />

        <Outlet />

        <script
          async
          src="https://stats.richardleek.com/script.js"
          data-website-id="549d5e91-57c9-4aea-8b3b-139d39a302cd"
        ></script>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
