import { PROTECTED_PROPERTIES } from './constants';
import { canCopyProperty, toStringDescriptor, toStringName } from './helpers';
import { FunctionDefinition, ImitateOptions } from './types';

/**
 * Mimics the behavior and properties of the `from` function on the `to` function.
 * @param to The function that needs to imitate another function.
 * @param from The function to be imitated.
 * @param options Configuration options.
 */
export function imitate(
  to: FunctionDefinition,
  from: FunctionDefinition,
  options: ImitateOptions = {},
): FunctionDefinition {
  if (typeof to !== 'function' || typeof from !== 'function') {
    throw new TypeError('Both `to` and `from` arguments must be functions.');
  }

  const { name } = to;

  for (const property of Reflect.ownKeys(from)) {
    if (PROTECTED_PROPERTIES.has(property as string)) {
      continue;
    }

    const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);

    if (!fromDescriptor) {
      continue;
    }

    const toDescriptor = Object.getOwnPropertyDescriptor(to, property);

    if (!toDescriptor) {
      continue;
    }

    if (
      canCopyProperty(toDescriptor, fromDescriptor) ||
      !options.ignoreNonConfigurable
    ) {
      Object.defineProperty(to, property, fromDescriptor);
    }
  }

  // Change prototype if they're different
  const fromPrototype = Object.getPrototypeOf(from);
  if (fromPrototype !== Object.getPrototypeOf(to)) {
    Object.setPrototypeOf(to, fromPrototype);
  }

  // Modify toString method
  const withName = name.trim() ? `with ${name.trim()}() ` : '';
  const newToString = function (): string {
    return `/* Wrapped ${withName}*/\n${from.toString()}`;
  };
  Object.defineProperty(newToString, 'name', toStringName);
  Object.defineProperty(to, 'toString', {
    ...toStringDescriptor,
    value: newToString,
  });

  return to;
}
