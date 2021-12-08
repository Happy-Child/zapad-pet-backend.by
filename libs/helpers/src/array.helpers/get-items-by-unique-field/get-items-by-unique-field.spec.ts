import { getItemsByUniqueField } from './index';
import { NonEmptyArray } from '@app/types';

type TMockItem = { field: string; id: number };
const entryData: NonEmptyArray<TMockItem> = [
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
    field: 'test4',
    id: 6,
  },
  {
    field: 'test4',
    id: 7,
  },
  {
    field: 'test5',
    id: 8,
  },
];
const outputData: NonEmptyArray<string> = [
  'test',
  'test2',
  'test3',
  'test4',
  'test5',
];

describe('getItemsByUniqueField', () => {
  it('should return array with unique items by field', () => {
    expect(getItemsByUniqueField<TMockItem>('field', entryData)).toStrictEqual(
      outputData,
    );
  });
});
