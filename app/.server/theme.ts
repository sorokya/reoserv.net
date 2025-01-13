import { createCookie } from 'react-router';

const themeCookie = createCookie('theme', {
  httpOnly: true,
  secure: true,
});

async function getThemeFromCookies(request: Request) {
  const theme = await themeCookie.parse(request.headers.get('Cookie'));
  return theme === 'dark' ? 'dark' : 'light';
}

export { getThemeFromCookies, themeCookie };
