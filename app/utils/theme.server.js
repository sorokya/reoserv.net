import { createCookie } from '@remix-run/node';

export const themeCookie = createCookie('theme', {
  httpOnly: true,
  secure: true,
});

export async function getThemeFromCookies(request) {
  const theme = await themeCookie.parse(request.headers.get('Cookie'));
  return theme || 'light';
}
