/* @flow */

import { PropTypes, Component } from 'react';
import invariant from 'invariant';
import { createRouteFromReactElement, RouteTypes } from './RouteUtils';
import { notImplemented, component } from './PropTypes';
import { NONE } from './transitionRegistry';

type Props = {
  path: string,
  component: ReactClass,
  overlayComponent: ?ReactClass,
  components: ?any,
  getComponent: ?any,
  getComponents: ?any,
  interpolator: ?string,
};

const { TABS } = RouteTypes;

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
    interpolator: PropTypes.string,
  };

  static defaultProps = {
    routeType: TABS,
    interpolator: NONE,
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
