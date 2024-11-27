import { Link } from 'react-router';
import type { Route } from './+types/route';

export const meta: Route.MetaFunction = () => [
  { title: '404 - Page not found | REOSERV' },
  {
    name: 'description',
    content: 'The page you are looking for does not exist',
  },
];

export default function Component() {
  return (
    <>
      <h1 className="mb-1 font-bold text-3xl">404 - Page not found</h1>
      <p>
        Click{' '}
        <Link to="/" className="text-blue-500 underline">
          here
        </Link>{' '}
        to go home.
      </p>
    </>
  );
}
