/* eslint-env node, jest */
const number = require('../src/modules/number');

describe('Test if number is valid', () => {
  it('should validate number', () => {
    expect(number.isValid(10)).toBe(true);
  });
  it('should validate validate string', () => {
    expect(number.isValid('1')).toBe(true);
  });
  it('should not validate true string', () => {
    expect(number.isValid('foo')).toBe(false);
  });
  it('should not validate infinity', () => {
    expect(number.isValid(Infinity)).toBe(false);
  });
  it('should not validate overintegers', () => {
    expect(number.isValid(1e1000)).toBe(false);
  });
  it('should validate greater or equal zero', () => {
    expect(number.isValid(0)).toBe(true);
  });
  it('should not validate less than zero', () => {
    expect(number.isValid(-1)).toBe(false);
  });
});

describe('Check if stack given is valid', () => {
  const stack = str => number.isValidStack(str);

  it('should throw if stack isnt well formed', () => {
    expect(stack('20-60-5')).toBe(false);
  });

  it('should throw if stack has not good order', () => {
    expect(stack('100-60')).toBe(false);
  });

  it('should validate if stack is well formed', () => {
    expect(stack('0-100')).toBe(true);
  });

  it('should throw if min isnt a valid number', () => {
    expect(stack('foo-60')).toBe(false);
  });

  it('should throw if max isnt a valid number', () => {
    expect(stack('50-bar')).toBe(false);
  });

  it('should throw an overflowed number', () => {
    expect(stack('50-1e1000')).toBe(false);
  });

  it('should throw if max is > 100', () => {
    expect(stack('50-101')).toBe(false);
  });

  it('should validate if stack is correct', () => {
    expect(stack('0-100')).toBe(true);
  });
});
