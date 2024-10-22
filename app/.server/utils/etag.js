import crypto from 'node:crypto';

function etag(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

export { etag };
