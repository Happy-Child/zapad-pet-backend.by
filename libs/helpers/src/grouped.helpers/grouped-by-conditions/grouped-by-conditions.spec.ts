import { groupedByConditions, groupedByNull, isNull } from '@app/helpers';

type TMockItem = { id: number; name: string | null; age: number | null };

const mockData = [
  {
    id: 1,
    name: 'name1',
    age: 45,
  },
  {
    id: 2,
    name: 'name2',
    age: 10,
  },
  {
    id: 3,
    name: 'name3',
    age: null,
  },
  {
    id: 4,
    name: null,
    age: 45,
  },
  {
    id: 5,
    name: 'name52',
    age: 45,
  },
  {
    id: 6,
    name: null,
    age: null,
  },
];

describe('groupedByConditions', () => {
  it('should return array with grouped items by conditions', () => {
    expect(
      groupedByConditions<TMockItem>(mockData, [
        (item) => !isNull(item.age) && item.age > 30,
        (item) => !isNull(item.name) && item.name.endsWith('2'),
        (item) => isNull(item.age) && isNull(item.name),
      ]),
    ).toStrictEqual([
      [
        {
          id: 1,
          name: 'name1',
          age: 45,
        },
        {
          id: 4,
          name: null,
          age: 45,
        },
        {
          id: 5,
          name: 'name52',
          age: 45,
        },
      ],
      [
        {
          id: 2,
          name: 'name2',
          age: 10,
        },
        {
          id: 5,
          name: 'name52',
          age: 45,
        },
      ],
      [
        {
          id: 6,
          name: null,
          age: null,
        },
      ],
    ]);
  });
});

describe('groupedByNull', () => {
  it('should return array with grouped items by nullable key of value', () => {
    expect(groupedByNull(mockData, 'age')).toStrictEqual([
      [
        {
          id: 1,
          name: 'name1',
          age: 45,
        },
        {
          id: 2,
          name: 'name2',
          age: 10,
        },
        {
          id: 4,
          name: null,
          age: 45,
        },
        {
          id: 5,
          name: 'name52',
          age: 45,
        },
      ],
      [
        {
          id: 3,
          name: 'name3',
          age: null,
        },
        {
          id: 6,
          name: null,
          age: null,
        },
      ],
    ]);
    expect(groupedByNull(mockData, 'name')).toStrictEqual([
      [
        {
          id: 1,
          name: 'name1',
          age: 45,
        },
        {
          id: 2,
          name: 'name2',
          age: 10,
        },
        {
          id: 3,
          name: 'name3',
          age: null,
        },
        {
          id: 5,
          name: 'name52',
          age: 45,
        },
      ],
      [
        {
          id: 4,
          name: null,
          age: 45,
        },
        {
          id: 6,
          name: null,
          age: null,
        },
      ],
    ]);
  });
});
