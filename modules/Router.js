/* @flow */

import React from 'react';
import { Router } from 'react-router';
import nativeHistory from './nativeHistory';
import createNativeContext from './createNativeContext';

import { createRoutes } from 'react-router/es6/RouteUtils';

const NativeRouter = (props: any): ReactElement => {
  const { routes, children } = props;

  // Leak route definition into native context
  const nativeContext = createNativeContext(createRoutes(routes || children));

  return (
    <Router history={nativeHistory} render={nativeContext} {...props} />
  );
};

export default NativeRouter;
