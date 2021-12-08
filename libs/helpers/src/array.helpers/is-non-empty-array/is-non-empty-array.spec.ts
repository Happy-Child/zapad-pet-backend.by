import { isNonEmptyArray } from './index';

describe('isNonEmptyArray', () => {
  it('should return true if array is not empty', () => {
    expect(isNonEmptyArray([1, 2, 3, 4])).toBe(true);
    expect(isNonEmptyArray([{}, 2, 4, 'test', [], () => 5])).toBe(true);
    expect(isNonEmptyArray([])).toBe(false);
  });
});
