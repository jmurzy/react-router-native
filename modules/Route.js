/* @flow */

import { PropTypes, Component } from 'react';
import invariant from 'invariant';
import { createRouteFromReactElement } from './RouteUtils';
import { notImplemented, component } from './PropTypes';

type Props = {
  path: ?string,
  component: ReactClass,
  overlayComponent: ?ReactClass,
  components: ?any,
  getComponent: ?any,
  getComponents: ?any,
};

/* eslint-disable react/require-render-return */
class Route extends Component<any, Props, any> {

  static createRouteFromReactElement = createRouteFromReactElement;

  static propTypes = {
    path: PropTypes.string,
    component,
    overlayComponent: component,
    components: notImplemented,
    getComponent: notImplemented,
    getComponents: notImplemented,
  };

  static defaultProps = {
    routeType: 'single',
  };

  props: Props;

  render() {
    invariant(
      false,
      '<Route> elements are for router configuration only and should not be rendered'
    );
  }
}
/* eslint-enable */

export default Route;
