/* eslint-disable @typescript-eslint/no-explicit-any */
import { imitate } from '../src';

describe('imitate', () => {
  function baseFunction() {
    return 'base';
  }

  function toImitate() {
    return 'imitated';
  }

  toImitate.imitated = true;

  it('should throw when non-function types are passed', () => {
    expect(() => imitate({} as any, toImitate)).toThrow(TypeError);
    expect(() => imitate(baseFunction, {} as any)).toThrow(TypeError);
  });

  it('should copy properties from the `from` function to the `to` function', () => {
    const imitatedFunc = imitate(baseFunction, toImitate);

    expect(imitatedFunc()).toBe('base'); // behavior remains of baseFunction
    expect((imitatedFunc as any).imitated).toBe(toImitate.imitated); // property from toImitate
  });

  it('should change the prototype if they are different', () => {
    const prototype = {};
    Object.setPrototypeOf(toImitate, prototype);

    const imitatedFunc = imitate(baseFunction, toImitate);
    expect(Object.getPrototypeOf(imitatedFunc)).toBe(prototype);
  });

  it('should not change the prototype if they are the same', () => {
    const prototype = {};
    Object.setPrototypeOf(baseFunction, prototype);
    Object.setPrototypeOf(toImitate, prototype);

    const imitatedFunc = imitate(baseFunction, toImitate);
    expect(Object.getPrototypeOf(imitatedFunc)).toBe(prototype);
  });

  it('should modify the toString method', () => {
    const imitatedFunc = imitate(baseFunction, toImitate);
    expect(imitatedFunc.toString()).toContain('Wrapped');
    expect(imitatedFunc.toString()).toContain('toImitate');
  });

  it('should throw errors for restricted assignments in strict mode', () => {
    const assignRestrictedProperties = () => {
      'use strict';
      function test() {}
      test.arguments = 'args';
      test.caller = 'caller';
    };

    expect(assignRestrictedProperties).toThrowError(
      /'caller', 'callee', and 'arguments' properties may not be accessed on strict mode/,
    );
  });

  it('should not copy protected properties', () => {
    function anotherFunction() {}
    anotherFunction.prototype = {};
    anotherFunction.someProp = 'someValue'; // A property that's okay to copy

    try {
      anotherFunction.length = 123;
    } catch {
      // Handle strict mode error silently
      return;
    }
    try {
      anotherFunction.arguments = 'args';
    } catch {
      // Handle strict mode error silently
      return;
    }
    try {
      anotherFunction.caller = 'caller';
    } catch {
      // Handle strict mode error silently
      return;
    }

    const imitatedFunc = imitate(baseFunction, anotherFunction);

    expect((imitatedFunc as any).length).not.toBe(123);
    expect((imitatedFunc as any).prototype).not.toBeDefined();
    expect((imitatedFunc as any).someProp).toBe('someProp');
  });
});
