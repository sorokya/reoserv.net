import {
  type HeadersFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
  redirect,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getNewsArticle } from '../.server/get-news-article';
import { ProseContainer } from '../components/prose-container';

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control') ?? '',
  ETag: loaderHeaders.get('ETag') ?? '',
});

export const meta: MetaFunction<typeof loader> = ({ params, data }) => {
  const parts = params.name?.split('-') ?? [];
  parts.splice(0, 3); // remove date
  const title = parts
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return [
    { title: `${title} | REOSERV` },
    { name: 'description', value: data.article.description },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
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
  } = useLoaderData<typeof loader>();

  return (
    <ProseContainer>
      <header>
        <span className="mb-4 block text-sand-10">{date}</span>
        <h1 className="mb-0">{title}</h1>
        <p className="lead mt-4">{description}</p>
      </header>
      <div
        // biome-ignore lint/security/noDangerouslySetInnerHtml: this markdown content isn't user submitted
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </ProseContainer>
  );
}
