/* @flow */

import { PropTypes, Component } from 'react';
import invariant from 'invariant';
import { createRouteFromReactElement } from './RouteUtils';
import { notImplemented, component } from './PropTypes';

type Props = {
  path: string,
  component: ReactClass,
  overlayComponent: ?ReactClass,
  components: ?any,
  getComponent: ?any,
  getComponents: ?any,
};

/* eslint-disable react/require-render-return */
class Tabs extends Component<any, Props, any> {

  static createRouteFromReactElement = createRouteFromReactElement;

  static propTypes = {
    path: PropTypes.string.isRequired, // Stack and Tab cannot be used as no-path routes.
    component,
    overlayComponent: component,
    components: notImplemented,
    getComponent: notImplemented,
    getComponents: notImplemented,
  };

  static defaultProps = {
    routeType: 'tabs',
  };

  props: Props;

  render() {
    invariant(
      false,
      '<Tabs> elements are for router configuration only and should not be rendered'
    );
  }
}
/* eslint-enable */

export default Tabs;
