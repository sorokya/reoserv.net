import { getThemeFromCookies, themeCookie } from '../utils/theme.server';

export async function action({ request }) {
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
