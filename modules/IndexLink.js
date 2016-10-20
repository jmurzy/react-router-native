/* @flow */

import React from 'react';
import Link from './Link';

const IndexLink = (props: any): ReactElement<any> => (
  /* eslint-disable jsx-a11y/anchor-has-content */
  <Link {...props} onlyActiveOnIndex />
    /* eslint-enable */
);

export default IndexLink;
