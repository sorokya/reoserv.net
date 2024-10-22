import type { ActionFunctionArgs } from '@remix-run/node';
import { getThemeFromCookies, themeCookie } from '../.server/theme';

export async function action({ request }: ActionFunctionArgs) {
  const currentTheme = await getThemeFromCookies(request);

  const headers = new Headers();
  headers.set('Location', request.headers.get('Referer') ?? '/');
  headers.set(
    'Set-Cookie',
    await themeCookie.serialize(currentTheme === 'light' ? 'dark' : 'light'),
  );

  return new Response(null, {
    status: 302,
    headers,
  });
}
