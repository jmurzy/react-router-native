/* @flow */

import React from 'react';
import RouterContext from './RouterContext';

const createNativeContext = (routeDefinition: any) => (props: any): ReactElement => (
  <RouterContext {...props} allRoutes={routeDefinition} />
);

export default createNativeContext;
