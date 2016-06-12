/* @flow */

import warning from 'warning';
import invariant from 'invariant';
import getRouteParams from 'react-router/es6/getRouteParams';
import { RouteTypes } from './RouteUtils';

import type {
  EnhancedNavigationRoute,
  Location,
  RouteDef,
  IndexRouteDef,
  NoPathRouteDef,
  RouteType,
  NavigationAction,
} from './TypeDefinition';

export const LOCATION_CHANGE = '@@router-native/LOCATION_CHANGE';

const { STACK_ROUTE, TABS_ROUTE, ROUTE } = RouteTypes;

const hasNextChild = leaf => leaf.routes && leaf.routes.length === 1;

const extractCapturedState = leaf => ({
  params: leaf.params,
  routeParams: leaf.routeParams,
  location: leaf.location,
});

export function defaultReducer(
  state: EnhancedNavigationRoute,
  action: NavigationAction,
): EnhancedNavigationRoute {
  const { nextNavigationState: nextState } = action;

  invariant(
    !!nextState && !!nextState.reducer,
    'Must define `reducer` for `%s`.',
    state.type
  );

  // TODO Drop `reducer` refs from `state` as it makes it not serializable
  const reducer = nextState.reducer;

  return reducer(state, action);
}

export function defaultRouteReducer(
  state: EnhancedNavigationRoute,
  action: NavigationAction,
): EnhancedNavigationRoute {
  invariant(
    state.type === ROUTE,
    '`%s` is configured with an invalid reducer.',
    state.type
  );

  const { nextNavigationState: nextState } = action;

  // `createState()` always returns a unary tree
  const nextLeaf = nextState.routes[0];

  if (!nextLeaf) {
    // Return `nextState` to reset state, or `state` to maintain state
    return nextState;
  }

  const foundIndex = state.routes.findIndex(leaf => nextLeaf && leaf.key === nextLeaf.key);
  const foundNextLeaf = foundIndex > -1;

  if (foundNextLeaf) {
    const foundLeaf = state.routes[foundIndex];
    // `nextLeaf` has one child, always. See `createState()`
    if (hasNextChild(nextLeaf)) {
      const nextAction: NavigationAction = {
        ...action,
        nextNavigationState: nextLeaf,
      };

      return {
        ...state,
        routes: [
          ...state.routes.slice(0, foundIndex),
          defaultReducer(foundLeaf, nextAction),
          ...state.routes.slice(foundIndex + 1, state.routes.length),
        ],
        index: foundIndex,
        ...extractCapturedState(nextState),
      };
    }

    // nextLeaf is the final leaf (nextState has no grandchild), update index and stop
    return {
      ...state,
      routes: [
        ...state.routes.slice(0, foundIndex),
        {
          ...foundLeaf,
          ...extractCapturedState(nextLeaf),
        },
        ...state.routes.slice(foundIndex + 1, state.routes.length),
      ],
      index: foundIndex,
      ...extractCapturedState(nextState),
    };
  }

  // Replace existing child
  return {
    ...state,
    routes: [
      nextLeaf,
    ],
    index: 0,
    ...extractCapturedState(nextState),
  };
}

export function defaultTabsRouteReducer(
  state: EnhancedNavigationRoute,
  action: NavigationAction,
): EnhancedNavigationRoute {
  invariant(
    state.type === TABS_ROUTE,
    '`%s` is configured with an invalid reducer.',
    state.type
  );

  const { nextNavigationState: nextState } = action;

  // `createState()` always returns a unary tree
  const nextLeaf = nextState.routes[0];

  if (!nextLeaf) {
    // Return `nextState` to reset state, or `state` to maintain state
    return nextState;
  }

  const foundIndex = state.routes.findIndex(leaf => nextLeaf && leaf.key === nextLeaf.key);
  const foundNextLeaf = foundIndex > -1;

  if (foundNextLeaf) {
    const foundLeaf = state.routes[foundIndex];
    // `nextLeaf` has one child, always. See `createState()`
    if (hasNextChild(nextLeaf)) {
      const nextAction: NavigationAction = {
        ...action,
        nextNavigationState: nextLeaf,
      };

      return {
        ...state,
        routes: [
          ...state.routes.slice(0, foundIndex),
          defaultReducer(foundLeaf, nextAction),
          ...state.routes.slice(foundIndex + 1, state.routes.length),
        ],
        index: foundIndex,
        ...extractCapturedState(nextState),
      };
    }

    // nextLeaf is the final leaf (nextState has no grandchild), update index and stop
    return {
      ...state,
      routes: [
        ...state.routes.slice(0, foundIndex),
        {
          ...foundLeaf,
          ...extractCapturedState(nextLeaf),
        },
        ...state.routes.slice(foundIndex + 1, state.routes.length),
      ],
      index: foundIndex,
      ...extractCapturedState(nextState),
    };
  }

  // Push a new child
  return {
    ...state,
    routes: [
      ...state.routes,
      nextLeaf,
    ],
    index: state.routes.length,
    ...extractCapturedState(nextState),
  };
}

export function defaultStackRouteReducer(
  state: EnhancedNavigationRoute,
  action: NavigationAction,
): EnhancedNavigationRoute {
  invariant(
    state.type === STACK_ROUTE,
    '`%s` is configured with an invalid reducer.',
    state.type
  );

  const { nextNavigationState: nextState } = action;

  // `createState()` always returns a unary tree
  const nextLeaf = nextState.routes[0];

  if (!nextLeaf) {
    // Return `nextState` to reset state, or `state` to maintain state
    return nextState;
  }

  const foundIndex = state.routes.findIndex(leaf => nextLeaf && leaf.key === nextLeaf.key);
  const foundNextLeaf = foundIndex > -1;

  if (foundNextLeaf) {
    const foundLeaf = state.routes[foundIndex];
    // `nextLeaf` has one child, always. See `createState()`
    if (hasNextChild(nextLeaf)) {
      const nextAction: NavigationAction = {
        ...action,
        nextNavigationState: nextLeaf,
      };

      return {
        ...state,
        routes: [
          ...state.routes.slice(0, foundIndex),
          defaultReducer(foundLeaf, nextAction),
          ...state.routes.slice(foundIndex + 1, state.routes.length),
        ],
        index: foundIndex,
        ...extractCapturedState(nextState),
      };
    }

    // nextLeaf is the final leaf (nextState has no grandchild), update index and stop For stacks,
    // when a location descriptor with the same key is pushed, it's assumed POP, re-activate leaf
    // and slice off the tail
    return {
      ...state,
      routes: [
        ...state.routes.slice(0, foundIndex + 1),
      ],
      index: foundIndex,
      ...extractCapturedState(nextState),
    };
  }

  // Push a new child
  return {
    ...state,
    routes: [
      ...state.routes,
      nextLeaf,
    ],
    index: state.routes.length,
    ...extractCapturedState(nextState),
  };
}

function getIndexRoute(route: RouteDef): ?IndexRouteDef {
  if (!route.path && !route.childRoutes && !route.routeType) {
    return {
      component: route.component,
      overlayComponent: route.overlayComponent,
    };
  }
  return null;
}

function getNoPathRoute(route: RouteDef): ?NoPathRouteDef {
  if (!route.path && route.childRoutes && route.routeType === ROUTE) {
    return {
      childRoutes: route.childRoutes,
      component: route.component,
      overlayComponent: route.overlayComponent,
      routeType: ROUTE,
    };
  }
  return null;
}

export function createState(
  routes: any,
  location: Location,
  params: Object
): EnhancedNavigationRoute {
  /* eslint-disable consistent-return */
  function reduceRoutes(
    prevState: EnhancedNavigationRoute,
    currentRoute: RouteDef,
    index: number,
    allRoutes: Array<RouteDef>
  ): EnhancedNavigationRoute {
    let parentRoute;

    if (index > 0) {
      parentRoute = allRoutes[index - 1];
    }

    let path = currentRoute.path;
    let key = currentRoute.path;
    let type = currentRoute.routeType;
    let routeParams = getRouteParams(currentRoute, params);
    const transition = currentRoute.transition;
    const reducer = currentRoute.reducer;

    const indexRoute = getIndexRoute(currentRoute);

    if (indexRoute) {
      path = '[index]';
      key = '__index__';
      type = 'index';
      routeParams = getRouteParams(parentRoute, params);
    }

    const noPathRoute = getNoPathRoute(currentRoute);

    if (noPathRoute) {
      // Need access to previous route's children for calculating position of no-path routes Taking
      // into account no-path routes at root
      let positionInParent = 0;

      if (parentRoute && parentRoute.childRoutes) {
        positionInParent = parentRoute.childRoutes.findIndex(r => r === currentRoute);
      }
      path = `[visual]${positionInParent}`;
      key = `__visual__${positionInParent}`;
      type = currentRoute.routeType; // || 'visual'
    }

    const stateKey = location.state.stateKey;

    if (parentRoute && parentRoute.routeType === STACK_ROUTE) {
      key = `${key}_${stateKey}`;
    }

    if (key && path && type) {
      const state = {
        key,
        index: 0,
        routes: [],
        path,
        type,
        routeParams,
        params,
        location,
        transition,
        reducer,
      };

      if (prevState) {
        return {
          ...state,
          index: 0,
          routes: [prevState],
        };
      }

      return state;
    }
    invariant(false,
      'Incompatible route definition. Make sure peer dependecy requirements are met.',
    );
  }
  /* eslint-enable */
  return routes.reduceRight(reduceRoutes, null);
}

const canPop = (pos: number, state: EnhancedNavigationRoute) => {
  const index = state.index + pos;
  return index >= 0;
};

export function canPopActiveStack(
  n: number,
  leafState: EnhancedNavigationRoute,
  parentState: ?EnhancedNavigationRoute
): ?Location {
  if (leafState.routes && leafState.routes.length > 0) {
    return canPopActiveStack(n, leafState.routes[leafState.index], leafState);
  }

  // Can pop only if active leaf is of a stack
  if (parentState && parentState.type === STACK_ROUTE) {
    if (!canPop(n, parentState)) {
      warning(
        false,
        'Cannot pop(%s) stack cannot be emptied',
        n
      );

      return null;
    }

    const popTo = parentState.index + n;
    return parentState.routes[popTo].location;
  }

  warning(
    false,
    'Cannot pop %s scene',
    (parentState ? parentState.type : '')
  );

  return null;
}

function getActiveRouteTypeAtIndex(index: number, routes: Array<RouteDef>): ?RouteType {
  if (routes && routes.length > 1) {
    return routes[index].routeType;
  }
  return null;
}

export function getActiveRouteType(routes: Array<RouteDef>): ?RouteType {
  return getActiveRouteTypeAtIndex(routes.length - 1, routes);
}

export function getActiveParentRouteType(routes: Array<RouteDef>): ?RouteType {
  return getActiveRouteTypeAtIndex(routes.length - 2, routes);
}

export function getActiveLocation(leafState: EnhancedNavigationRoute): ?Location {
  if (leafState.routes && leafState.routes.length > 0) {
    return getActiveLocation(leafState.routes[leafState.index]);
  }

  return leafState.location;
}
