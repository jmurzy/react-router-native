/* @flow */

import React from 'react';
import { Router } from 'react-router';
import nativeHistory from './nativeHistory';
import nativeContext from './nativeContext';

const NativeRouter = (props: any): ReactElement => (
  <Router history={nativeHistory} render={nativeContext} {...props} />
);

export default NativeRouter;
