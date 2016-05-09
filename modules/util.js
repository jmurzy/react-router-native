/* @flow */

export function isEmptyObject(object: Object) {
  for (const p in object) { // eslint-disable-line
    if (Object.prototype.hasOwnProperty.call(object, p)) {
      return false;
    }
  }
  return true;
}
