/* @flow */

import React, { PropTypes, Component } from 'react';

type Props = {};

type Context = {
  router: Object,
};

export default (WrappedComponent: ReactClass<any>) => (
  class extends Component<any, Props, any> {

    static contextTypes = {
      router: PropTypes.object,
    };

    constructor(props: Props, context: Context) {
      super(props);
      this.router = context.router;
    }

    router: Object;
    context: Context;
    props: Props;

    render() {
      const props = this.props;

      return (
        <WrappedComponent router={this.router} {...props} />
      );
    }
  }
);
