import { COOKIES_OPTIONS } from 'config';

export const COOKIE = {
  ACCESS_TOKEN: COOKIES_OPTIONS.TOKEN_NAME,
  SECURE_OPTIONS: {
    httpOnly: true,
    secure: COOKIES_OPTIONS.SECURE,
    sameSite: COOKIES_OPTIONS.SAME_SITE,
  },
};
