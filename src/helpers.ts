export const toStringDescriptor: PropertyDescriptor =
  Object.getOwnPropertyDescriptor(Function.prototype, 'toString')!;

export const toStringName: PropertyDescriptor = Object.getOwnPropertyDescriptor(
  Function.prototype.toString,
  'name',
)!;

/**
 * Checks if a property can be safely copied from source to destination descriptor.
 * @param toDescriptor The destination descriptor.
 * @param fromDescriptor The source descriptor.
 */
export function canCopyProperty(
  toDescriptor: PropertyDescriptor | undefined,
  fromDescriptor: PropertyDescriptor,
): boolean {
  return (
    !toDescriptor ||
    toDescriptor.configurable ||
    (toDescriptor.writable === fromDescriptor.writable &&
      toDescriptor.enumerable === fromDescriptor.enumerable &&
      toDescriptor.configurable === fromDescriptor.configurable &&
      (toDescriptor.writable || toDescriptor.value === fromDescriptor.value))
  );
}
