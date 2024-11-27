import { invariant } from '@epic-web/invariant';
import { redirect } from 'react-router';
import { getNewsArticle } from '~/.server/get-news-article';
import { ProseContainer } from '~/components/prose-container';
import type { Route } from './+types/route';

export async function loader({ request, params }: Route.LoaderArgs) {
  invariant(params.name, 'name is required');

  const article = await getNewsArticle(params.name);

  if (!article) {
    throw redirect('/404');
  }

  return { article };
}

export default function Article({ loaderData }: Route.ComponentProps) {
  const {
    article: { title, date, content, description },
  } = loaderData;

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
