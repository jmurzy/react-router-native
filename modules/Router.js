/* @flow */

import React from 'react';
import { Router, createRoutes } from 'react-router';
import nativeHistory from './nativeHistory';
import createNativeContext from './createNativeContext';

const NativeRouter = (props: any): ReactElement => {
  const { routes, children } = props;

  // Leak route definition into native context
  const nativeContext = createNativeContext(createRoutes(routes || children));

  return (
    <Router history={nativeHistory} render={nativeContext} {...props} />
  );
};

export default NativeRouter;
