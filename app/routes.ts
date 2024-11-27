import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  layout('./routes/_news/route.tsx', [
    index('./routes/_news.index/route.tsx'),
    route('404', './routes/_news.404/route.tsx'),
  ]),
  route('news/:name', './routes/news.$name/route.tsx'),
  ...prefix('docs', [
    index('./routes/docs.index/route.tsx'),
    route(':name', './routes/docs.$name/route.tsx'),
  ]),
  route('theme', './routes/theme/route.tsx'),
  route('*', './routes/$/route.tsx'),
] satisfies RouteConfig;
