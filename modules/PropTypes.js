/* @flow */

import { PropTypes } from 'react';

export function notImplemented(props: Object, propName: string, componentName: string): ?Error {
  if (props[propName]) {
    return new Error(`<${componentName}> "${propName}" is not implemented.`);
  }
  return null;
}

export function falsy(props: Object, propName: string, componentName: string): ?Error {
  if (props[propName]) {
    return new Error(`<${componentName}> should not have a "${propName}" prop.`);
  }
  return null;
}

export const component = PropTypes.oneOfType([PropTypes.func, PropTypes.string]);
