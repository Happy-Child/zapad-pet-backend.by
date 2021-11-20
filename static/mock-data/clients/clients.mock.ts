import { ClientEntity } from '@app/entities';

export const MOCK_CLIENTS_MAP: Record<string, Partial<ClientEntity>> = {
  CLIENT_1: {
    id: 1,
    name: 'Name of best client 1',
  },
  CLIENT_2: {
    id: 2,
    name: 'Some telecom company',
  },
  CLIENT_3: {
    id: 3,
    name: 'Is company to company to company and telecom fake large name',
  },
  CLIENT_4: {
    id: 4,
    name: 'Example name vary vary vary vary YES so vary to company and telecom fake large name',
  },
};
