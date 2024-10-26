import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import { getThemeFromCookies, themeCookie } from '../.server/theme';

export async function action({ request }: ActionFunctionArgs) {
  const currentTheme = await getThemeFromCookies(request);
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  throw redirect(request.headers.get('Referer') ?? '/', {
    headers: {
      'Set-Cookie': await themeCookie.serialize(newTheme),
    },
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  throw redirect(request.headers.get('Referer') ?? '/');
}
