/* @flow */

import warning from 'warning';
import invariant from 'invariant';
import RouteView from './RouteView';
import StackView from './StackView';
import TabsView from './TabsView';
import transitionRegistry from './transitionRegistry';
import {
  createRouteFromReactElement as _createRouteFromReactElement,
} from 'react-router/es6/RouteUtils';
import type { RouteDef, ElementProvider } from './TypeDefinition';

export const RouteTypes = {
  STACK_ROUTE: '<StackRoute>',
  TABS_ROUTE: '<TabsRoute>',
  ROUTE: '<Route>',
};

const { STACK_ROUTE, TABS_ROUTE } = RouteTypes;

export function createRouteFromReactElement(element: ReactElement,
                                            parentRoute: RouteDef): ReactElement {
  invariant(
    !element.props.interpolator || transitionRegistry[element.props.interpolator] !== undefined,
    '"%s" is not a valid interpolator. If you are using a custom interpolator, make sure to ' +
    'register it with `transitionRegistry`',
    element.props.interpolator
  );

  warning(
    !element.props.overlayComponent || parentRoute
      && (parentRoute.routeType === STACK_ROUTE || parentRoute.routeType === TABS_ROUTE),
    'overlayComponent does not make sense outside of <StackRoute> or <TabsRoute>'
  );

  warning(
    !parentRoute || parentRoute.routeType !== STACK_ROUTE
      || (element.props.routeType !== STACK_ROUTE && element.props.routeType !== TABS_ROUTE),
    '<TabsRoute> and <StackRoute> cannot be nested within <StackRoute>'
  );

  return _createRouteFromReactElement(element);
}

function createNavigationTree(createElement: ElementProvider,
                              routes: Array<RouteDef>,
                              route: RouteDef,
                              positionInParent: number): ?ReactElement {
  const props = {};

  props.path = route.path || `[visual]${positionInParent}`;
  props.type = route.routeType;
  props.navigationComponent = route.component;

  if (route.overlayComponent) {
    props.overlayComponent = route.overlayComponent;
  }

  if (route.childRoutes) {
    props.navScenes = route.childRoutes.map(
      (r, index) => createNavigationTree(createElement, routes, r, index)
    );

    // index route is given in `routes` but not in `childRoutes`
    if (route.indexRoute) {
      const indexRouteProps = {};

      indexRouteProps.path = '[index]';
      indexRouteProps.type = 'index';
      indexRouteProps.navigationComponent = route.indexRoute.component;

      if (route.indexRoute.overlayComponent) {
        indexRouteProps.overlayComponent = route.indexRoute.overlayComponent;
      }

      const indexRouteEl = createElement(RouteView, indexRouteProps);

      props.navScenes.unshift(indexRouteEl);
    }
  }

  let el;
  if (route.routeType === STACK_ROUTE) {
    el = createElement(StackView, props);
  } else if (route.routeType === TABS_ROUTE) {
    el = createElement(TabsView, props);
  } else {
    el = createElement(RouteView, props);
  }
  return el;
}

export function createNavigation(createElement: ElementProvider,
                                 routes: Array<RouteDef>) {
  const rootRoute = routes && routes.length && routes[0];

  if (!rootRoute) {
    return null;
  }

  return createNavigationTree(createElement, routes, rootRoute, 0);
}
