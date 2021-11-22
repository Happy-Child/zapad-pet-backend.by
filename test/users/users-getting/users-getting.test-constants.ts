import { getObjWithoutFields } from '@app/helpers';
import { MOCK_ENGINEERS_MAP } from '../../../static/mock-data/users/engineers.mock';

export const TEST_USERS_GETTING_ENGINEERS_VALID_RESPONSE = [
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_9, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_8, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_7, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_6, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_5, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_4, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_3, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_2, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_16, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_15, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_14, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_13, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_12, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_11, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_10, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_1, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
];
