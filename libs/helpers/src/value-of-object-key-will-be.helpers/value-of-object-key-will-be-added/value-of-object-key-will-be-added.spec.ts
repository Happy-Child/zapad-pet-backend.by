import { valueOfObjectKeyWillBeAdded } from './index';

type TItem = {
  name: string | null;
  age: number | null;
};

describe('valueOfObjectKeyWillBeAdded', () => {
  it('should return true if next object key by added', () => {
    expect(
      valueOfObjectKeyWillBeAdded<TItem>(
        { name: 'test', age: null },
        { name: 'newName', age: null },
        'name',
        'string',
      ),
    ).toBe(false);

    expect(
      valueOfObjectKeyWillBeAdded<TItem>(
        { name: 'test', age: null },
        { name: null, age: null },
        'name',
        'string',
      ),
    ).toBe(true);

    expect(
      valueOfObjectKeyWillBeAdded<TItem>(
        { name: null, age: null },
        { name: null, age: null },
        'name',
        'string',
      ),
    ).toBe(false);

    expect(
      valueOfObjectKeyWillBeAdded<TItem>(
        { name: null, age: null },
        { name: 'newName', age: null },
        'name',
        'string',
      ),
    ).toBe(false);

    expect(
      valueOfObjectKeyWillBeAdded<TItem>(
        { name: null, age: null },
        { name: null, age: null },
        'age',
      ),
    ).toBe(false);

    expect(
      valueOfObjectKeyWillBeAdded<TItem>(
        { name: null, age: 214532 },
        { name: null, age: 213 },
        'age',
      ),
    ).toBe(false);

    expect(
      valueOfObjectKeyWillBeAdded<TItem>(
        { name: null, age: 213 },
        { name: null, age: null },
        'age',
      ),
    ).toBe(true);
  });
});
