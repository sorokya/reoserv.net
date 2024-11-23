import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  layout('./routes/layout.tsx', [
    index('./routes/home.tsx'),
    route('404', './routes/404.tsx'),
  ]),
  ...prefix('docs', [
    index('./routes/docs.index.tsx'),
    route(':name', './routes/docs.$name.tsx'),
  ]),
    route('news/:name', './routes/news.$name.tsx'),
  route('theme', './routes/theme.tsx'),
  route('*', './routes/$.tsx'),
] satisfies RouteConfig;
