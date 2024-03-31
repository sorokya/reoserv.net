import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react';

import styles from './tailwind.css?url';

import { Header } from './components/header';

export const links = () => [{ rel: 'stylesheet', href: styles }];

export function Layout({ children }) {
  return (
    <html style={{ background: "url('/back.jpg')" }} lang="en">
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
      <body className="mx-auto min-h-screen w-5/6 border-2 border-gray-200 border-x bg-gray-50 px-4 xl:w-3/5">
        {children}
        {process.env.NODE_ENV !== 'development' && (
          <script
            async
            defer
            src="https://stats.richardleek.com/script.js"
            data-website-id="549d5e91-57c9-4aea-8b3b-139d39a302cd"
          />
        )}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    );
  }

  return (
    <>
      <h1>Error!</h1>
      <p>{error?.message ?? 'Unknown error'}</p>
    </>
  );
}
