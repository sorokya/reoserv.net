import { Link } from '@remix-run/react';

export default function FourOFour() {
  return (
    <>
      <title>404 - Page not found | REOSERV</title>

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
