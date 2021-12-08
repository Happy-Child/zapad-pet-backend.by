import { isNull, isObject, isUndefined } from './index';

describe('isNull', () => {
  it('should be an null', () => {
    expect(isNull(null)).toBe(true);

    expect(isNull(undefined)).toBe(false);
    expect(isNull('null')).toBe(false);
    expect(isNull('   ')).toBe(false);
    expect(isNull(true)).toBe(false);
    expect(isNull(1)).toBe(false);
    expect(isObject(() => 'fn')).toBe(false);
    expect(isNull('esr4erd')).toBe(false);
    expect(isNull({})).toBe(false);
    expect(isNull([])).toBe(false);
    expect(isNull(Symbol())).toBe(false);
  });
});

describe('isUndefined', () => {
  it('should be an undefined', () => {
    expect(isUndefined(undefined)).toBe(true);

    expect(isUndefined(null)).toBe(false);
    expect(isUndefined('undefined')).toBe(false);
    expect(isUndefined('   ')).toBe(false);
    expect(isUndefined(true)).toBe(false);
    expect(isUndefined(1)).toBe(false);
    expect(isUndefined('esr4erd')).toBe(false);
    expect(isUndefined({})).toBe(false);
    expect(isObject(() => 'fn')).toBe(false);
    expect(isUndefined([])).toBe(false);
    expect(isUndefined(Symbol())).toBe(false);
  });
});

describe('isObject', () => {
  it('should be an object', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 123, b: 'test' })).toBe(true);

    expect(isObject(null)).toBe(false);
    expect(isObject('undefined')).toBe(false);
    expect(isObject('   ')).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject(1)).toBe(false);
    expect(isObject(() => 'fn')).toBe(false);
    expect(isObject('esr4erd')).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isObject(Symbol())).toBe(false);
  });
});
