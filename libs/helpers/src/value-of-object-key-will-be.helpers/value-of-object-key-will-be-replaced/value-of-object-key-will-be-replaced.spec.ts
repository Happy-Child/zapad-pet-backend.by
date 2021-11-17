import { valueOfObjectKeyWillBeReplaced } from '@app/helpers';

type TItem = {
  name: string | null;
  age: number | null;
};

describe('valueOfObjectKeyWillBeReplaced', () => {
  it('should return true if next object key by replaced', () => {
    expect(
      valueOfObjectKeyWillBeReplaced<TItem>(
        { name: 'test', age: null },
        { name: 'newName', age: null },
        'name',
        'string',
      ),
    ).toBe(true);

    expect(
      valueOfObjectKeyWillBeReplaced<TItem>(
        { name: 'test', age: null },
        { name: null, age: null },
        'name',
        'string',
      ),
    ).toBe(false);

    expect(
      valueOfObjectKeyWillBeReplaced<TItem>(
        { name: null, age: null },
        { name: null, age: null },
        'name',
        'string',
      ),
    ).toBe(false);

    expect(
      valueOfObjectKeyWillBeReplaced<TItem>(
        { name: null, age: null },
        { name: 'newName', age: null },
        'name',
        'string',
      ),
    ).toBe(false);

    expect(
      valueOfObjectKeyWillBeReplaced<TItem>(
        { name: null, age: null },
        { name: null, age: null },
        'age',
      ),
    ).toBe(false);

    expect(
      valueOfObjectKeyWillBeReplaced<TItem>(
        { name: null, age: 214532 },
        { name: null, age: 213 },
        'age',
      ),
    ).toBe(true);

    expect(
      valueOfObjectKeyWillBeReplaced<TItem>(
        { name: null, age: null },
        { name: null, age: 213 },
        'age',
      ),
    ).toBe(false);
  });
});
