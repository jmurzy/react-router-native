/* @flow */

/* eslint-disable import/prefer-default-export */
export function isEmptyObject(object: Object) {
/* eslint-enable */
  for (const p in object) { // eslint-disable-line
    if (Object.prototype.hasOwnProperty.call(object, p)) {
      return false;
    }
  }
  return true;
}
