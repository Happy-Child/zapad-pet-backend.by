import { groupedByChangedFields } from '@app/helpers';

type TMockItem = { id: number; name: string | null; age: number | null };

describe('groupedByChangedFields', () => {
  it('should return object with grouped items by changed fields', () => {
    expect(
      groupedByChangedFields<TMockItem>(
        [
          { id: 1, name: null, age: 20 },
          { id: 2, name: 'newName2', age: 32 },
          { id: 3, name: null, age: null },
          { id: 4, name: 'name4', age: 40 },
        ],
        [
          { id: 1, name: 'name1', age: 20 },
          { id: 2, name: 'name2', age: 19 },
          { id: 3, name: 'name3', age: 30 },
          { id: 4, name: 'name4', age: 40 },
        ],
        ['name', 'age'],
      ),
    ).toStrictEqual({
      name: [
        { id: 1, name: null, age: 20 },
        { id: 2, name: 'newName2', age: 32 },
        { id: 3, name: null, age: null },
      ],
      age: [
        { id: 2, name: 'newName2', age: 32 },
        { id: 3, name: null, age: null },
      ],
    });
  });
});
