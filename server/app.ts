import 'react-router';
import { createRequestHandler } from '@react-router/express';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';

declare module 'react-router' {
  interface AppLoadContext {
    VALUE_FROM_EXPRESS: string;
  }
}

export const app = express();

// set a clockOffset cookie to help render dates correctly on the server
app.use((req: Request, res: Response, next: NextFunction) => {
  const cookies = req.headers.cookie;

  if (cookies?.includes('clockOffset')) {
    return next();
  }

  const script = `
      const offset = new Date().getTimezoneOffset() * -1;
      document.cookie = 'clockOffset=' + offset + '; path=/'; 
      window.location.reload();
    `;
  res.set('Content-Type', 'text/html');
  res.set('Set-Cookie', 'clockOffset=0; path=/');
  res.set('Refresh', `0; url=${req.originalUrl}`);
  res.send(`<html><body><script>${script}</script></body></html>`);
});

app.use(
  createRequestHandler({
    // @ts-expect-error - virtual module provided by React Router at build time
    build: () => import('virtual:react-router/server-build'),
    getLoadContext() {
      return {
        VALUE_FROM_EXPRESS: 'Hello from Express',
      };
    },
  }),
);
