import { NonEmptyArray } from '@app/types';
import { getUniquePrimitiveArray } from './index';

const entryDataNumbers: NonEmptyArray<number> = [
  1, 1, 2, 2, 3, 4, 4, 4, 4, 4, 4, 5, 6, 6, 6, 6, 6,
];
const outputDataNumbers: NonEmptyArray<number> = [1, 2, 3, 4, 5, 6];

const entryDataStrings: NonEmptyArray<string> = [
  'test',
  'test',
  'test',
  'name',
  'name',
  'name2',
  'name2',
  'nAMe2',
  '1',
  '1',
  '2',
  '2',
  '3',
  'surname',
];
const outputDataStrings: NonEmptyArray<string> = [
  'test',
  'name',
  'name2',
  'nAMe2',
  '1',
  '2',
  '3',
  'surname',
];

const entryDataAny: NonEmptyArray<string | number> = [
  'test',
  'test',
  'keys',
  'kEYs',
  1,
  1,
  2,
  2,
  2,
  3,
  3,
];
const outputDataAny: NonEmptyArray<string | number> = [
  'test',
  'keys',
  'kEYs',
  1,
  2,
  3,
];

describe('getUniquePrimitiveArray', () => {
  it('should return array with unique primitive elements', () => {
    expect(getUniquePrimitiveArray(entryDataNumbers)).toStrictEqual(
      outputDataNumbers,
    );
    expect(getUniquePrimitiveArray(entryDataStrings)).toStrictEqual(
      outputDataStrings,
    );
    expect(getUniquePrimitiveArray(entryDataAny)).toStrictEqual(outputDataAny);
  });
});
