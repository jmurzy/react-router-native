/* @flow */

import React from 'react';
import { Router, createRoutes } from 'react-router';
import nativeHistory from './nativeHistory';
import createNativeContext from './createNativeContext';

const NativeRouter = (props: any): ReactElement => {
  const { routes, children, render, ...rest } = props;

  const computedRoutes = createRoutes(routes || children);
  // Leak route definition into native context
  const nativeContext = (render || createNativeContext)(computedRoutes);

  return (
    <Router
      history={nativeHistory}
      render={nativeContext}
      routes={computedRoutes}
      {...rest}
    />
  );
};

export default NativeRouter;
