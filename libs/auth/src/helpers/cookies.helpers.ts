import { JWT } from 'config';
import ms from 'ms';

export const getCookieExpiration = () => {
  return new Date(Date.now() + ms(JWT.EXPIRATION));
};
