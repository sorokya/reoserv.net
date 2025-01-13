import { redirect } from 'react-router';
import { getThemeFromCookies, themeCookie } from '~/.server/theme';
import type { Route } from './+types/route';

export async function action({ request }: Route.ActionArgs) {
  const currentTheme = await getThemeFromCookies(request);
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  throw redirect(request.headers.get('Referer') ?? '/', {
    headers: {
      'Set-Cookie': await themeCookie.serialize(newTheme),
    },
  });
}

export async function loader({ request }: Route.LoaderArgs) {
  throw redirect(request.headers.get('Referer') ?? '/');
}
