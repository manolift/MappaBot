/* eslint-env node, jest */
const number = require('../src/modules/number');
const expect = require('expect');

describe('Test number module', () => {
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
