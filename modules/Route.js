/* @flow */

import { PropTypes, Component } from 'react';
import invariant from 'invariant';
import {
  createRouteFromReactElement as _createRouteFromReactElement,
  RouteTypes,
} from './RouteUtils';
import { defaultRouteReducer } from './ReducerUtils';
import { notImplemented, component } from './PropTypes';

type Props = {
  component: ReactClass,
  components: ?any,
  getComponent: ?any,
  getComponents: ?any,
  overlayComponent: ?ReactClass,
  path: ?string,
  reducer: Function,
  routeType: string,
  transition: ?string,
};

const { ROUTE } = RouteTypes;

/* eslint-disable react/require-render-return */
class Route extends Component<any, Props, any> {

  static createRouteFromReactElement = _createRouteFromReactElement;

  static propTypes = {
    component,
    components: notImplemented,
    getComponent: notImplemented,
    getComponents: notImplemented,
    overlayComponent: component,
    path: PropTypes.string,
    reducer: PropTypes.func.isRequired,
    routeType: PropTypes.string.isRequired,
    transition: PropTypes.string,
  };

  static defaultProps = {
    routeType: ROUTE,
    reducer: defaultRouteReducer,
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
