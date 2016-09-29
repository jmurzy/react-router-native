/* @flow */

import { PropTypes, Component } from 'react';
import invariant from 'invariant';
import {
  createRouteFromReactElement as _createRouteFromReactElement,
  RouteTypes,
} from './RouteUtils';
import { defaultTabsRouteReducer } from './ReducerUtils';
import { notImplemented, component } from './PropTypes';
import { NONE } from './transitionRegistry';

type Props = {
  component: ReactClass<any>,
  components: ?any,
  getComponent: ?any,
  getComponents: ?any,
  overlayComponent: ?ReactClass<any>,
  path: string,
  reducer: Function,
  routeType: string,
  transition: string,
  gestureResponseDistance?: ?number,
};

const { TABS_ROUTE } = RouteTypes;

/* eslint-disable react/require-render-return */
class TabsRoute extends Component<any, Props, any> {

  static createRouteFromReactElement = _createRouteFromReactElement;

  static propTypes = {
    component,
    components: notImplemented,
    getComponent: notImplemented,
    getComponents: notImplemented,
    overlayComponent: component,
    path: PropTypes.string.isRequired, // StackRoute and TabsRoute cannot be used as no-path routes.
    reducer: PropTypes.func.isRequired,
    routeType: PropTypes.string.isRequired,
    transition: PropTypes.string.isRequired,
    gestureResponseDistance: PropTypes.number,
  };

  static defaultProps = {
    reducer: defaultTabsRouteReducer,
    routeType: TABS_ROUTE,
    transition: NONE,
  };

  props: Props;

  render() {
    invariant(
      false,
      '<TabsRoute> elements are for router configuration only and should not be rendered'
    );
  }
}
/* eslint-enable */

export default TabsRoute;
