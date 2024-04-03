import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react';
import { Header } from './components/header';
import styles from './tailwind.css?url';

export const links = () => [
  { rel: 'icon', type: 'image/png', href: '/favicon-32.png' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'true' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Ubuntu:ital,wght@0,400;0,700;1,400;1,700&display=swap',
  },
  { rel: 'stylesheet', href: styles },
];

export function Layout({ children }) {
  return (
    <html lang="en">
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
        <Meta />
        <Links />
      </head>
      <body className="relative grid min-h-screen font-sans text-sand-12 antialiased before:absolute before:top-0 before:bottom-0 before:left-0 before:w-full before:bg-[url('/back.jpg')] selection:bg-amber-6 dark:before:invert-[.95]">
        <main className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 border-sand-7 border-x bg-amber-1 px-4 md:px-8">
          {children}
        </main>
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
      <footer className="py-4 text-sand-11 text-sm" />
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
