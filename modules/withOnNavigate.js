/* @flow */

import React, { PropTypes, Component } from 'react';

type Props = {};

type Context = {
  onNavigate: Function,
};

export default (RouteViewComponent: ReactClass) => (
  class extends Component<any, Props, any> {

    static contextTypes = {
      onNavigate: PropTypes.func.isRequired,
    };

    constructor(props: Props, context: Context) {
      super(props);

      const { onNavigate } = context;

      this.onNavigate = onNavigate;
    }

    onNavigate: Function;
    context: Context;
    props: Props;

    render() {
      const props = this.props;

      return (
        <RouteViewComponent onNavigate={this.onNavigate} {...props} />
      );
    }
  }
);
