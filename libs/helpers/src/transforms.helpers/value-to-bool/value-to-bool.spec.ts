import { valueToBool } from './index';

describe('valueToBool', () => {
  it('should be an boolead', () => {
    expect(valueToBool('true')).toBe(true);
    expect(valueToBool('false')).toBe(false);
    expect(valueToBool('0')).toBe(false);
    expect(valueToBool('1')).toBe(true);
    expect(valueToBool('on')).toBe(true);
    expect(valueToBool('off')).toBe(false);
    expect(valueToBool('yes')).toBe(true);
    expect(valueToBool('no')).toBe(false);
    expect(valueToBool(true)).toBe(true);
    expect(valueToBool(false)).toBe(false);
  });

  it('should be an input value', () => {
    expect(valueToBool('testaesdfx')).toBe('testaesdfx');
    expect(valueToBool('truetrue')).toBe('truetrue');
    expect(valueToBool('0000')).toBe('0000');
    expect(valueToBool('yesyesyes')).toBe('yesyesyes');
    expect(valueToBool(null)).toBe(null);
    expect(valueToBool(undefined)).toBe(undefined);
    const obj = {};
    expect(valueToBool(obj)).toBe(obj);
    const fn = () => {
      console.log('');
    };
    expect(valueToBool(fn)).toBe(fn);
  });
});
