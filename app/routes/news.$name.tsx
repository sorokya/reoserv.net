import { invariant } from '@epic-web/invariant';
import { type LoaderFunctionArgs, data, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getNewsArticle } from '~/.server/get-news-article';
import { ProseContainer } from '~/components/prose-container';

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    invariant(params.name, 'name is required');
    const article = await getNewsArticle(params.name);
    return data(
      { article },
      {
        headers: {
          'Cache-Control': 'max-age=3600, public',
          ETag: article.etag,
        },
      },
    );
  } catch (e) {
    console.error('There was an error getting the article', e);
    throw redirect('/404');
  }
}

export default function Article() {
  const {
    article: { title, date, content, description },
  } = useLoaderData<typeof loader>();

  return (
    <>
      <title>{`${title} | REOSERV`}</title>
      <meta name="description" content={description} />

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
    </>
  );
}
