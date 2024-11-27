import { invariant } from '@epic-web/invariant';
import { redirect } from 'react-router';
import { getDocsPage } from '~/.server/get-docs-page';
import { ProseContainer } from '~/components/prose-container';
import type { Route } from './+types/route';
import { Nav } from './nav';

export async function loader({ params }: Route.LoaderArgs) {
  invariant(params.name, 'name is required');

  const page = await getDocsPage(params.name);

  if (!page) {
    throw redirect('/404');
  }

  return { page };
}

export default function Docs({ loaderData }: Route.ComponentProps) {
  const {
    page: { title, content, description },
  } = loaderData;

  return (
    <>
      <title>{`${title} | Docs | REOSERV`}</title>
      <meta name="description" content={description} />

      <div className="grid gap-12 md:grid-cols-4">
        <div className="p-1 md:col-span-1 md:py-0">
          <Nav />
        </div>
        <div className="md:col-span-3">
          <ProseContainer>
            <h1>{title}</h1>
            <div
              className="pb-2"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: this markdown content isn't user submitted
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </ProseContainer>
        </div>
      </div>
    </>
  );
}
