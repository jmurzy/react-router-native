/* @flow */

import React from 'react';
import Link from './Link';

const IndexLink = (props: any): ReactElement => (
  <Link {...props} onlyActiveOnIndex />
);

export default IndexLink;
