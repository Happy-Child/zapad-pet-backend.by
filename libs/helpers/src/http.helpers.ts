import { COOKIE } from '../../../src/modules/auth/constants';

export const logoutByResponse = (res: any, response: unknown) => {
  res.clearCookie(COOKIE.ACCESS_TOKEN);
  res.send(response);
};
