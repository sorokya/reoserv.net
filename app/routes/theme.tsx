import { type ActionFunctionArgs, redirect } from '@remix-run/node';
import { getThemeFromCookies, themeCookie } from '../.server/theme';

export async function action({ request }: ActionFunctionArgs) {
  const currentTheme = await getThemeFromCookies(request);
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  return redirect(request.headers.get('Referer') ?? '/', {
    headers: {
      'Set-Cookie': await themeCookie.serialize(newTheme),
    },
  });
}
