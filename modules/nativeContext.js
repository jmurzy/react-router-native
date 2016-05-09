/* @flow */

import React from 'react';
import RouterContext from './RouterContext';

const render = (props: any): ReactElement => (
  <RouterContext {...props} />
);

export default render;
