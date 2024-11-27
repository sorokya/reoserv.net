import { redirect } from 'react-router';
import { getNewsArticle } from '~/.server/get-news-article';
import { getClockOffset } from '~/.server/utils/clock-offset';
import { getPrettyDate } from '~/.server/utils/pretty-date';
import { ProseContainer } from '~/components/prose-container';
import type { Route } from './+types/route';

export const meta: Route.MetaFunction = ({ data }) => {
  const { article } = data;

  return [
    { title: `${article.title} | REOSERV` },
    { name: 'description', content: article.description },
  ];
};

export async function loader({ params, request }: Route.LoaderArgs) {
  const article = await getNewsArticle(params.name);

  if (!article) {
    throw redirect('/404');
  }

  return {
    article: {
      ...article,
      localDate: getPrettyDate(article.date, getClockOffset(request)),
    },
  };
}

export default function Component({ loaderData }: Route.ComponentProps) {
  const { article } = loaderData;

  return (
    <ProseContainer>
      <header>
        <time dateTime={article.date} className="mb-4 block text-sand-10">
          {article.localDate}
        </time>
        <h1 className="mb-0">{article.title}</h1>
        <p className="lead mt-4">{article.description}</p>
      </header>
      <div
        // biome-ignore lint/security/noDangerouslySetInnerHtml: this markdown content isn't user submitted
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </ProseContainer>
  );
}
