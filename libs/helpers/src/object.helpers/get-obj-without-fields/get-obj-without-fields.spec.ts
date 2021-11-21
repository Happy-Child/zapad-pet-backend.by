import { getObjWithoutFields } from '@app/helpers';

type TMockItem = { id: number; name: string; age: number };
type TMockItemNew = { age: number };

const mockData = {
  id: 1,
  name: 'name1',
  age: 20,
};

describe('getObjWithoutFields', () => {
  it('should return object without fields', () => {
    expect(
      getObjWithoutFields<TMockItem, TMockItemNew>(mockData, ['id', 'name']),
    ).toStrictEqual({
      age: 20,
    });

    expect(
      getObjWithoutFields<TMockItem, TMockItemNew>(mockData, [
        'id',
        'name',
        'age',
      ]),
    ).toStrictEqual({});

    expect(
      getObjWithoutFields<TMockItem, TMockItemNew>(mockData, ['age', 'name']),
    ).toStrictEqual({
      id: 1,
    });

    expect(
      getObjWithoutFields<TMockItem, TMockItemNew>(mockData, []),
    ).toStrictEqual(mockData);
  });
});
