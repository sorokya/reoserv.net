import { createCookie } from 'react-router';

export const themeCookie = createCookie('theme', {
  httpOnly: true,
  secure: true,
});

export async function getThemeFromCookies(request: Request) {
  const theme = await themeCookie.parse(request.headers.get('Cookie'));
  return theme === 'dark' ? 'dark' : 'light';
}
