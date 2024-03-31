import '@fontsource/ubuntu';
import '@fontsource/ubuntu-mono';
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
import './styles/app.css';

export function Layout({ children }) {
  return (
    <html
      lang="en"
      // toggle the below to enable dark mode
      //  className="group/apptheme dark"
    >
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
      <body className="relative grid min-h-screen font-sans antialiased before:absolute before:top-0 before:bottom-0 before:left-0 before:w-full before:bg-[url('/back.jpg')] group-[.dark]/apptheme:before:invert-95">
        <main className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 border-gray-6 border-x bg-accent-1 px-8 text-gray-12">
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
      <footer className="py-4 text-gray-11 text-sm" />
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
