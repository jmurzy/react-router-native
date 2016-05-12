/* @flow */

import warning from 'warning';
import SceneView from './SceneView';
import StackView from './StackView';
import TabsView from './TabsView';
import {
  createRouteFromReactElement as _createRouteFromReactElement,
} from 'react-router/es6/RouteUtils';
import type { RouteDef, ElementProvider } from './TypeDefinition';

export const RouteTypes = {
  STACK: 'STACK',
  TABS: 'TABS',
  SINGLE: 'SINGLE',
};

const { STACK, TABS } = RouteTypes;

export function createRouteFromReactElement(element: ReactElement,
                                            parentRoute: RouteDef): ReactElement {
  if (element.props.overlayComponent && (!parentRoute
        || parentRoute.routeType !== STACK && parentRoute.routeType !== TABS)) {
    warning(false, 'overlayComponent does not make sense outside of <Stack> or <Tabs>');
  }

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

      const indexRouteEl = createElement(SceneView, indexRouteProps);

      props.navScenes.unshift(indexRouteEl);
    }
  }

  let el;
  if (route.routeType === STACK) {
    el = createElement(StackView, props);
  } else if (route.routeType === TABS) {
    el = createElement(TabsView, props);
  } else {
    el = createElement(SceneView, props);
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
