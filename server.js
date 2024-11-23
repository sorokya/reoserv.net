import { createRequestHandler } from '@remix-run/express';
import compression from 'compression';
import express from 'express';
import morgan from 'morgan';

const viteDevServer =
  process.env.NODE_ENV === 'production'
    ? undefined
    : await import('vite').then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        }),
      );

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
    : await import('./build/server/index.js'),
});

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    '/assets',
    express.static('build/client/assets', { immutable: true, maxAge: '1y' }),
  );
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('build/client', { maxAge: '1h' }));

app.use(morgan('tiny'));

// set a clockOffset cookie to help render dates correctly on the server
app.use((req, res, next) => {
  const cookies = req.headers.cookie;

  if (!cookies || !cookies.includes('clockOffset')) {
    const script = `document.cookie = 'clockOffset=' + (new Date().getTimezoneOffset() * -1) + '; path=/'; window.location.reload();`;
    res.set('Content-Type', 'text/html');
    res.set('Set-Cookie', 'clockOffset=0; path=/');
    res.set('Refresh', `0; url=${req.originalUrl}`);
    return res.send(`<html><body><script>${script}</script></body></html>`);
  }

  next();
});

// handle SSR requests
app.all('*', remixHandler);

const port = process.env.PORT || 3030;
app.listen(port, () =>
  console.log(`Express server listening at http://localhost:${port}`),
);
