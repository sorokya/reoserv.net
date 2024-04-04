import { useLoaderData } from '@remix-run/react';
import { ProseContainer } from '../components/prose-container';
import { getDownloadsArticle } from '../utils/get-downloads-article.server';

export function meta() {
  return [{ title: 'Downloads | REOSERV' }];
}

export async function loader({ request, params }) {
  try {
    const article = await getDownloadsArticle(request);
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

export default function Downloads() {
  const {
    article: { title, lastmod, content, description },
  } = useLoaderData();

  return (
    <ProseContainer>
      <header>
        <span className="mb-4 block text-sand-10">
          Last updated on {lastmod}
        </span>
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
