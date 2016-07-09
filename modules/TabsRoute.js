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
  path: string,
  component: ReactClass,
  overlayComponent: ?ReactClass,
  components: ?any,
  getComponent: ?any,
  getComponents: ?any,
  transition: ?string,
  reducer: ?Function
};

const { TABS_ROUTE } = RouteTypes;

/* eslint-disable react/require-render-return */
class TabsRoute extends Component<any, Props, any> {

  static createRouteFromReactElement = _createRouteFromReactElement;

  static propTypes = {
    path: PropTypes.string.isRequired, // StackRoute and TabsRoute cannot be used as no-path routes.
    component,
    overlayComponent: component,
    components: notImplemented,
    getComponent: notImplemented,
    getComponents: notImplemented,
    transition: PropTypes.string,
    reducer: PropTypes.func,
  };

  static defaultProps = {
    routeType: TABS_ROUTE,
    transition: NONE,
    reducer: defaultTabsRouteReducer,
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
