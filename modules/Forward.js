/* @flow */

import React from 'react';
import Go from './Go';

const Forward = (props: any): ReactElement<any> => (
  <Go {...props} type="forward" />
);

export default Forward;
