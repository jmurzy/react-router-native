/* @flow */

import React from 'react';
import Go from './Go';

const Pop = (props: any): ReactElement<any> => (
  <Go {...props} type="back" />
);

export default Pop;
