import { valueOfObjectKeyWillBeDeleted } from '@app/helpers';

type TItem = {
  name: string | null;
  age: number | null;
};

describe('valueOfObjectKeyWillBeDeleted', () => {
  it('should return true if next object key by deleted', () => {
    expect(
      valueOfObjectKeyWillBeDeleted<TItem>(
        { name: 'test', age: null },
        { name: 'newName', age: null },
        'name',
        'string',
      ),
    ).toBe(false);

    expect(
      valueOfObjectKeyWillBeDeleted<TItem>(
        { name: 'test', age: null },
        { name: null, age: null },
        'name',
        'string',
      ),
    ).toBe(false);

    expect(
      valueOfObjectKeyWillBeDeleted<TItem>(
        { name: null, age: null },
        { name: null, age: null },
        'name',
        'string',
      ),
    ).toBe(false);

    expect(
      valueOfObjectKeyWillBeDeleted<TItem>(
        { name: null, age: null },
        { name: 'newName', age: null },
        'name',
        'string',
      ),
    ).toBe(true);

    expect(
      valueOfObjectKeyWillBeDeleted<TItem>(
        { name: null, age: null },
        { name: null, age: null },
        'age',
      ),
    ).toBe(false);

    expect(
      valueOfObjectKeyWillBeDeleted<TItem>(
        { name: null, age: 214532 },
        { name: null, age: 213 },
        'age',
      ),
    ).toBe(false);

    expect(
      valueOfObjectKeyWillBeDeleted<TItem>(
        { name: null, age: null },
        { name: null, age: 213 },
        'age',
      ),
    ).toBe(true);
  });
});
