// The clockOffset cookie is set in the server/app.ts file

// use a named capture group
const regex = /clockOffset=(?<clockOffset>[+-\d]+)/;

function getClockOffset(request: Request) {
  const cookie = request.headers.get('Cookie');
  const clockOffset = cookie?.match(regex)?.groups?.clockOffset;
  return Number.parseInt(clockOffset ?? '0', 10);
}

export { getClockOffset };
