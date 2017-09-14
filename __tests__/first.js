/* eslint-env node, jest */
const expect = require('expect');
const first = require('../src/modules/first');

describe('Test for first command', () => {
  it('should be false at the start', () => {
    expect(first.first).toBe(false);
  });

  it('should throw because no one did first', () => {
    expect(first.hasBeenDone()).toBe(false);
  });

  it('should have no timer if no first', () => {
    expect(first.timer).toBe(undefined);
  });

  it('should do first the first time', () => {
    first.do(() => {
      expect(first.first).toBe(true);
    });
  });

  it('should do it for only one instance', () => {
    expect(first.first).toBe(true);
  });

  it('should not throw because someone firsted', () => {
    expect(first.hasBeenDone()).toBe(true);
  });

  it('should launch if first has been done', () => {
    expect(first.timer).toBeDefined();
  });
});
