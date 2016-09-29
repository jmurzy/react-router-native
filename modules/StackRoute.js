/* @flow */

import { PropTypes, Component } from 'react';
import invariant from 'invariant';
import {
  createRouteFromReactElement as _createRouteFromReactElement,
  RouteTypes,
} from './RouteUtils';
import { defaultStackRouteReducer } from './ReducerUtils';
import { notImplemented, component } from './PropTypes';
import { HORIZONTAL_CARD_STACK } from './transitionRegistry';

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

const { STACK_ROUTE } = RouteTypes;

/* eslint-disable react/require-render-return */
class StackRoute extends Component<any, Props, any> {

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
    reducer: defaultStackRouteReducer,
    routeType: STACK_ROUTE,
    transition: HORIZONTAL_CARD_STACK,
  };

  props: Props;

  render() {
    invariant(
      false,
      '<StackRoute> elements are for router configuration only and should not be rendered'
    );
  }
}
/* eslint-enable */

export default StackRoute;
