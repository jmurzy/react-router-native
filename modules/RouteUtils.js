/* @flow */

import warning from 'warning';
import invariant from 'invariant';
import RouteView from './RouteView';
import StackRouteView from './StackRouteView';
import TabsRouteView from './TabsRouteView';
import transitionRegistry from './transitionRegistry';
import {
  createRouteFromReactElement as _createRouteFromReactElement,
} from 'react-router/es6/RouteUtils';
import type {
  RouteDef,
  ElementProvider,
  PseudoElement,
} from './TypeDefinition';

export const RouteTypes = {
  STACK_ROUTE: '<StackRoute>',
  TABS_ROUTE: '<TabsRoute>',
  ROUTE: '<Route>',
};

const { STACK_ROUTE, TABS_ROUTE } = RouteTypes;

export function createRouteFromReactElement(
  element: ReactElement<any>,
  parentRoute: RouteDef
): ReactElement<any> {
  invariant(
    !element.props.transition || transitionRegistry[element.props.transition] !== undefined,
    '"%s" is not a valid transition. If you are using a custom transition, make sure to ' +
    'register it with `transitionRegistry`.',
    element.props.transition
  );

  warning(
    !element.props.overlayComponent || parentRoute
      && (parentRoute.routeType === STACK_ROUTE || parentRoute.routeType === TABS_ROUTE),
    'overlayComponent does not make sense outside of <StackRoute> or <TabsRoute>.'
  );

  warning(
    !parentRoute || parentRoute.routeType !== STACK_ROUTE
      || (element.props.routeType !== STACK_ROUTE && element.props.routeType !== TABS_ROUTE),
    '<TabsRoute> and <StackRoute> cannot be nested within <StackRoute>.'
  );

  return _createRouteFromReactElement(element);
}

function getPropsFromRoute(route: RouteDef): Object {
  const {
    childRoutes,
    component,
    overlayComponent,
    path,
    routeType,
    transition,
    reducer,
    indexRoute,
    ...rest,
  } = route;
  return rest;
}

function createNavigationTreeAtIndex(
  createElement: ElementProvider,
  routes: Array<RouteDef>,
  route: RouteDef,
  positionInParent: number
): ?PseudoElement {
  const {
    childRoutes,
    component,
    overlayComponent,
    path,
    routeType,
    indexRoute,
  } = route;

  const props = {
    ...getPropsFromRoute(route),
    route,
    routes,
  };

  props.createElement = createElement;
  props.path = path || `[visual]${positionInParent}`;
  props.type = routeType;
  props.component = component;

  if (overlayComponent) {
    props.overlayComponent = overlayComponent;
  }

  if (childRoutes) {
    props.navigationSubtree = childRoutes.map(
      (r, index) => createNavigationTreeAtIndex(createElement, routes, r, index)
    );

    // index route is given in `routes` but not in `childRoutes`
    if (indexRoute) {
      const indexRouteProps = {
        ...getPropsFromRoute(indexRoute),
        route: indexRoute,
        routes,
      };

      indexRouteProps.path = '[index]';
      indexRouteProps.type = 'index';
      indexRouteProps.component = indexRoute.component;
      indexRouteProps.createElement = createElement;

      if (indexRoute.overlayComponent) {
        indexRouteProps.overlayComponent = indexRoute.overlayComponent;
      }

      const indexRoutePseudoElement = {
        routeViewComponent: RouteView,
        props: indexRouteProps,
      };

      props.navigationSubtree.unshift(indexRoutePseudoElement);
    }
  }

  let pseudoElement;
  if (routeType === STACK_ROUTE) {
    pseudoElement = { routeViewComponent: StackRouteView, props };
  } else if (routeType === TABS_ROUTE) {
    pseudoElement = { routeViewComponent: TabsRouteView, props };
  } else {
    pseudoElement = { routeViewComponent: RouteView, props };
  }

  return pseudoElement;
}

export function createNavigationTree(
  createElement: ElementProvider,
  routes: Array<RouteDef>
): ?PseudoElement {
  const rootRoute = routes && routes.length && routes[0];
  if (!rootRoute) {
    return null;
  }

  return createNavigationTreeAtIndex(createElement, routes, rootRoute, 0);
}
