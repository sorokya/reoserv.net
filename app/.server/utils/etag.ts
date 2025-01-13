import crypto from 'node:crypto';

function etag(str: string) {
  return crypto.createHash('md5').update(str).digest('hex');
}

export { etag };
