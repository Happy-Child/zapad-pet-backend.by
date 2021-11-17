import { getIndexedArray } from '@app/helpers';
import { NonEmptyArray } from '@app/types';

const entryData: NonEmptyArray<object> = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
];

const outputData = [
  {
    id: 1,
    index: 0,
  },
  {
    id: 2,
    index: 1,
  },
  {
    id: 3,
    index: 2,
  },
  {
    id: 4,
    index: 3,
  },
  {
    id: 5,
    index: 4,
  },
];

describe('getIndexedArray', () => {
  it('should return an indexed array', () => {
    expect(getIndexedArray(entryData)).toStrictEqual(outputData);
  });
});
