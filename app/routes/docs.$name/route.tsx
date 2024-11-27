import { redirect } from 'react-router';
import { getDocsPage } from '~/.server/get-docs-page';
import { ProseContainer } from '~/components/prose-container';
import type { Route } from './+types/route';
import { Nav } from './nav';

export const meta: Route.MetaFunction = ({ data }) => {
  const { page } = data;

  return [
    { title: `${page.title} | Docs | REOSERV` },
    { name: 'description', content: page.description },
  ];
};

export async function loader({ params }: Route.LoaderArgs) {
  const page = await getDocsPage(params.name);

  if (!page) {
    throw redirect('/404');
  }

  return { page };
}

export default function Component({ loaderData }: Route.ComponentProps) {
  const { page } = loaderData;

  return (
    <div className="grid gap-12 md:grid-cols-4">
      <div className="p-1 md:col-span-1 md:py-0">
        <Nav />
      </div>
      <div className="md:col-span-3">
        <ProseContainer>
          <h1>{page.title}</h1>
          <div
            className="pb-2"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: this markdown content isn't user submitted
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </ProseContainer>
      </div>
    </div>
  );
}
