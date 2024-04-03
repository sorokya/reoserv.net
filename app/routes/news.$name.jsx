import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getNewsArticle } from '../utils/get-news-article.server';

export const headers = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control'),
  ETag: loaderHeaders.get('ETag'),
});

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
  const {
    article: { title, date, content, description },
  } = useLoaderData();

  return (
    <article className="prose dark:prose-invert max-w-[80ch] prose-table:w-auto prose-table:min-w-[60%] prose-table:max-w-full prose-pre:text-[1em]">
      <header>
        <span className="mb-4 block text-gray-10">{date}</span>
        <h1 className="mb-0">{title}</h1>
        <p className="lead mt-4">{description}</p>
      </header>
      <div
        // biome-ignore lint/security/noDangerouslySetInnerHtml: this markdown content isn't user submitted
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
