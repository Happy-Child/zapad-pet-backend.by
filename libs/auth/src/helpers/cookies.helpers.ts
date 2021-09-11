import { JWT } from 'config';
import * as ms from 'ms';

export const getCookieExpiration = () => {
  return new Date(Date.now() + ms(JWT.EXPIRATION));
};
