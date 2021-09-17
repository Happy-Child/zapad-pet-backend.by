import { COOKIES_OPTIONS } from 'config';

export const COOKIE = {
  ACCESS_TOKEN: 'PET_PROJECT_NIGGA_TOKEN',
  SECURE_OPTIONS: {
    httpOnly: true,
    secure: COOKIES_OPTIONS.SECURE,
    sameSite: COOKIES_OPTIONS.SAME_SITE,
  },
};
