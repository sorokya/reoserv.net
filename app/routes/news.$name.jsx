import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import getNewsArticle from '../utils/getNewsArticle.server';

import codeStyles from 'highlight.js/styles/github.min.css';
import styles from '../news.css';

export const headers = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control'),
  ETag: loaderHeaders.get('ETag'),
});

export const links = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: codeStyles },
];

export function meta({ params, data }) {
  const parts = params.name.split('-');
  parts.splice(0, 3); // remove date
  const title = parts
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return [
    { title: `${title} | REOSERV` },
    { name: 'description', value: data.article.description },
  ];
}

export async function loader({ request, params }) {
  try {
    const article = await getNewsArticle(params.name, request);
    return new Response(JSON.stringify({ article }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=3600, public',
        ETag: article.etag,
      },
    });
  } catch (e) {
    console.error('There was an error getting the article', e);
    return redirect('/404');
  }
}

export default function Article() {
  const { article } = useLoaderData();
  const { title, date, content } = article;

  return (
    <>
      <span className="block text-gray-400">{date}</span>
      <h1 className="mb-2 text-2xl">{title}</h1>
      <div
        id="article"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: this markdown content isn't user submitted
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
}
