/* @flow */

import { PropTypes, Component } from 'react';
import invariant from 'invariant';
import { createRouteFromReactElement, RouteTypes } from './RouteUtils';
import { defaultStackRouteReducer } from './ReducerUtils';
import { notImplemented, component } from './PropTypes';
import { HORIZONTAL_PAGER } from './transitionRegistry';

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

const { STACK_ROUTE } = RouteTypes;

/* eslint-disable react/require-render-return */
class StackRoute extends Component<any, Props, any> {

  static createRouteFromReactElement = createRouteFromReactElement;

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
    routeType: STACK_ROUTE,
    transition: HORIZONTAL_PAGER,
    reducer: defaultStackRouteReducer,
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
