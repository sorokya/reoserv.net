import compression from 'compression';
import express from 'express';
import morgan from 'morgan';

// Short-circuit the type-checking of the built output.
const BUILD_PATH = './build/server/index.js';
const DEVELOPMENT = process.env.NODE_ENV === 'development';
const PORT = Number.parseInt(process.env.PORT || '3030');

const app = express();

app.use(compression());
app.disable('x-powered-by');

if (DEVELOPMENT) {
  console.log('Starting development server');
  const viteDevServer = await import('vite').then((vite) =>
    vite.createServer({
      server: { middlewareMode: true },
    }),
  );
  app.use(viteDevServer.middlewares);
  app.use(async (req, res, next) => {
    try {
      const source = await viteDevServer.ssrLoadModule('./server/app.ts');
      return await source.app(req, res, next);
    } catch (error) {
      if (typeof error === 'object' && error instanceof Error) {
        viteDevServer.ssrFixStacktrace(error);
      }
      next(error);
    }
  });
} else {
  console.log('Starting production server');
  app.use(
    '/assets',
    express.static('build/client/assets', { immutable: true, maxAge: '1y' }),
  );
  app.use(express.static('build/client', { maxAge: '1h' }));
  app.use(await import(BUILD_PATH).then((mod) => mod.app));
}

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
