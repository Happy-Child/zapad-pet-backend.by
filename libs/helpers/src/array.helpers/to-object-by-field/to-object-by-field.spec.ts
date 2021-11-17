import { toObjectByField } from '@app/helpers';

type TMockItem = { field: string | number; id: number };
const entryData: TMockItem[] = [
  {
    field: 'test',
    id: 1,
  },
  {
    field: 'test2',
    id: 2,
  },
  {
    field: 'test2',
    id: 3,
  },
  {
    field: 'test2',
    id: 4,
  },
  {
    field: 'test3',
    id: 5,
  },
  {
    field: 10,
    id: 6,
  },
  {
    field: 10,
    id: 7,
  },
  {
    field: 20,
    id: 8,
  },
];

const outputData = {
  test: {
    field: 'test',
    id: 1,
  },
  test2: {
    field: 'test2',
    id: 4,
  },
  test3: {
    field: 'test3',
    id: 5,
  },
  '10': {
    field: 10,
    id: 7,
  },
  '20': {
    field: 20,
    id: 8,
  },
};

describe('toObjectByField', () => {
  it('should return object of grouped items by field', () => {
    expect(toObjectByField('field', entryData)).toStrictEqual(outputData);
  });
});
