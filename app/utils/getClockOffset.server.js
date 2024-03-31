export function getClockOffset(request) {
  return request.headers.get('Cookie')?.match(/clockOffset=(\d+)/);
}
