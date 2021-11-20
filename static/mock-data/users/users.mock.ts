import { USER_ROLES } from '@app/constants';

export const MOCK_ACCOUNTANT = {
  id: 33,
  name: 'accountant',
  email: 'accountant@mail.ru',
  role: USER_ROLES.ACCOUNTANT,
  emailConfirmed: true,
};

export const MOCK_MASTER = {
  id: 34,
  name: 'master',
  email: 'master@mail.ru',
  role: USER_ROLES.MASTER,
  emailConfirmed: true,
};
