/* @flow */

import { Component } from 'react';
import warning from 'warning';
import invariant from 'invariant';
import {
  createRouteFromReactElement as _createRouteFromReactElement,
  RouteTypes,
} from './RouteUtils';
import { notImplemented, falsy, component } from './PropTypes';

const { TABS_ROUTE } = RouteTypes;

type Props = {
  path: ?any,
  component: ReactClass,
  overlayComponent: ?ReactClass,
  components: ?any,
  getComponent: ?any,
  getComponents: ?any,
};

/* eslint-disable react/require-render-return */
class IndexRoute extends Component<any, Props, any> {

  static propTypes = {
    path: falsy,
    component,
    overlayComponent: component,
    components: notImplemented,
    getComponent: notImplemented,
    getComponents: notImplemented,
  };

  static createRouteFromReactElement = (element, parentRoute) => {
    warning(
      parentRoute.routeType !== TABS_ROUTE,
      'An <IndexRoute> is not allowed for <TabsRoute>'
    );

    if (parentRoute) {
      /* eslint-disable no-param-reassign */
      parentRoute.indexRoute = _createRouteFromReactElement(element, parentRoute);
      /* eslint-enable */
    } else {
      warning(
        false,
        'An <IndexRoute> does not make sense at the root of your route config'
      );
    }
  };

  props: Props;

  render(): ?ReactElement {
    invariant(
      false,
      '<IndexRoute> elements are for router configuration only and should not be rendered'
    );
  }
}
/* eslint-enable */

export default IndexRoute;
