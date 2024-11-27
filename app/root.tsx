import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteLoaderData,
} from 'react-router';
import { getThemeFromCookies } from '~/.server/theme';
import { Header } from '~/components/header';
import type { Route } from './+types/root';
import styles from './tailwind.css?url';

export async function loader({ request }: Route.LoaderArgs) {
  const theme = await getThemeFromCookies(request);
  return { theme } as const;
}

export const links: Route.LinksFunction = () => [
  { rel: 'icon', type: 'image/png', href: '/favicon-32.png' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Ubuntu:ital,wght@0,400;0,700;1,400;1,700&display=swap',
  },
  { rel: 'preload', as: 'style', href: styles, type: 'text/css' },
  { rel: 'stylesheet', href: styles },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const rootLoaderData = useRouteLoaderData<typeof loader>('root');
  const theme = rootLoaderData?.theme ?? 'light';

  return (
    <html lang="en" className={theme}>
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
      <body className="relative grid min-h-screen font-sans text-sand-12 antialiased selection:bg-amber-6 before:absolute before:top-0 before:bottom-0 before:left-0 before:w-full before:bg-[url(/back.jpg)] dark:before:invert-[.95] dark:before:saturate-[50%] dark:before:sepia-[.85]">
        <main className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 border-sand-7 border-x bg-amber-1 px-4 md:px-12">
          <Header theme={theme} />
          {children}
          <footer className="py-4 text-sand-11 text-sm" />
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
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
