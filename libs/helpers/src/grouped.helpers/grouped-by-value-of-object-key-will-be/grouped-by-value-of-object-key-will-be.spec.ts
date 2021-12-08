import { groupedByValueOfObjectKeyWillBe } from './index';

type TMockItem = { id: number; name: string | null; age: number | null };

const mockNextData = [
  {
    id: 1,
    name: 'newName1',
    age: 20,
  },
  {
    id: 2,
    name: 'name2',
    age: 25,
  },
  {
    id: 3,
    name: 'name3',
    age: null,
  },
  {
    id: 4,
    name: null,
    age: 100,
  },
  {
    id: 5,
    name: null,
    age: 50,
  },
];

const mockPrevData = [
  {
    id: 1,
    name: 'name1',
    age: 20,
  },
  {
    id: 2,
    name: 'name2',
    age: 25,
  },
  {
    id: 3,
    name: null,
    age: null,
  },
  {
    id: 4,
    name: null,
    age: 20,
  },
  {
    id: 5,
    name: 'test',
    age: null,
  },
];

describe('groupedByValueOfObjectKeyWillBe', () => {
  it('should return object with grouped items by value of object key will be', () => {
    expect(
      groupedByValueOfObjectKeyWillBe<TMockItem>(
        mockNextData,
        mockPrevData,
        'name',
        'string',
      ),
    ).toStrictEqual({
      added: [
        {
          id: 3,
          name: 'name3',
          age: null,
        },
      ],
      replaced: [
        {
          id: 1,
          name: 'newName1',
          age: 20,
        },
        {
          id: 2,
          name: 'name2',
          age: 25,
        },
      ],
      deleted: [
        {
          id: 5,
          name: null,
          age: 50,
        },
      ],
    });

    expect(
      groupedByValueOfObjectKeyWillBe<TMockItem>(
        mockNextData,
        mockPrevData,
        'age',
      ),
    ).toStrictEqual({
      added: [
        {
          id: 5,
          name: null,
          age: 50,
        },
      ],
      replaced: [
        {
          id: 1,
          name: 'newName1',
          age: 20,
        },
        {
          id: 2,
          name: 'name2',
          age: 25,
        },
        {
          id: 4,
          name: null,
          age: 100,
        },
      ],
      deleted: [],
    });
  });
});
