/* @flow */

import warning from 'warning';
import invariant from 'invariant';
import getRouteParams from 'react-router/es6/getRouteParams';
import { RouteTypes } from './RouteUtils';

import type {
  EnhancedNavigationState,
  Location,
  RouteDef,
  IndexRouteDef,
  NoPathRouteDef,
  RouteType,
  NavigationAction,
} from './TypeDefinition';

export const LOCATION_CHANGE = '@@router-native/LOCATION_CHANGE';

const { STACK_ROUTE, TABS_ROUTE, ROUTE } = RouteTypes;

const hasNextChild = leaf => leaf.children && leaf.children.length === 1;

const extractCapturedState = leaf => ({
  params: leaf.params,
  routeParams: leaf.routeParams,
  location: leaf.location,
});

export function defaultReducer(
  state: EnhancedNavigationState,
  action: NavigationAction,
): EnhancedNavigationState {
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
  state: EnhancedNavigationState,
  action: NavigationAction,
): EnhancedNavigationState {
  invariant(
    state.type === ROUTE,
    '`%s` is configured with an invalid reducer.',
    state.type
  );

  const { nextNavigationState: nextState } = action;

  // `creteState()` always returns a unary tree
  const nextLeaf = nextState.children[0];

  if (!nextLeaf) {
    // Return `nextState` to reset state, or `state` to maintain state
    return nextState;
  }

  const foundIndex = state.children.findIndex(leaf => nextLeaf && leaf.key === nextLeaf.key);
  const foundNextLeaf = foundIndex > -1;

  if (foundNextLeaf) {
    const foundLeaf = state.children[foundIndex];
    // `nextLeaf` has one child, always. See `createState()`
    if (hasNextChild(nextLeaf)) {
      const nextAction: NavigationAction = {
        ...action,
        nextNavigationState: nextLeaf,
      };

      return {
        ...state,
        children: [
          ...state.children.slice(0, foundIndex),
          defaultReducer(foundLeaf, nextAction),
          ...state.children.slice(foundIndex + 1, state.children.length),
        ],
        index: foundIndex,
        ...extractCapturedState(nextState),
      };
    }

    // nextLeaf is the final leaf (nextState has no grandchild), update index and stop
    return {
      ...state,
      children: [
        ...state.children.slice(0, foundIndex),
        {
          ...foundLeaf,
          ...extractCapturedState(nextLeaf),
        },
        ...state.children.slice(foundIndex + 1, state.children.length),
      ],
      index: foundIndex,
      ...extractCapturedState(nextState),
    };
  }

  // Replace existing child
  return {
    ...state,
    children: [
      nextLeaf,
    ],
    index: 0,
    ...extractCapturedState(nextState),
  };
}

export function defaultTabsRouteReducer(
  state: EnhancedNavigationState,
  action: NavigationAction,
): EnhancedNavigationState {
  invariant(
    state.type === TABS_ROUTE,
    '`%s` is configured with an invalid reducer.',
    state.type
  );

  const { nextNavigationState: nextState } = action;

  // `creteState()` always returns a unary tree
  const nextLeaf = nextState.children[0];

  if (!nextLeaf) {
    // Return `nextState` to reset state, or `state` to maintain state
    return nextState;
  }

  const foundIndex = state.children.findIndex(leaf => nextLeaf && leaf.key === nextLeaf.key);
  const foundNextLeaf = foundIndex > -1;

  if (foundNextLeaf) {
    const foundLeaf = state.children[foundIndex];
    // `nextLeaf` has one child, always. See `createState()`
    if (hasNextChild(nextLeaf)) {
      const nextAction: NavigationAction = {
        ...action,
        nextNavigationState: nextLeaf,
      };

      return {
        ...state,
        children: [
          ...state.children.slice(0, foundIndex),
          defaultReducer(foundLeaf, nextAction),
          ...state.children.slice(foundIndex + 1, state.children.length),
        ],
        index: foundIndex,
        ...extractCapturedState(nextState),
      };
    }

    // nextLeaf is the final leaf (nextState has no grandchild), update index and stop
    return {
      ...state,
      children: [
        ...state.children.slice(0, foundIndex),
        {
          ...foundLeaf,
          ...extractCapturedState(nextLeaf),
        },
        ...state.children.slice(foundIndex + 1, state.children.length),
      ],
      index: foundIndex,
      ...extractCapturedState(nextState),
    };
  }

  // Push a new child
  return {
    ...state,
    children: [
      ...state.children,
      nextLeaf,
    ],
    index: state.children.length,
    ...extractCapturedState(nextState),
  };
}

export function defaultStackRouteReducer(
  state: EnhancedNavigationState,
  action: NavigationAction,
): EnhancedNavigationState {
  invariant(
    state.type === STACK_ROUTE,
    '`%s` is configured with an invalid reducer.',
    state.type
  );

  const { nextNavigationState: nextState } = action;

  // `creteState()` always returns a unary tree
  const nextLeaf = nextState.children[0];

  if (!nextLeaf) {
    // Return `nextState` to reset state, or `state` to maintain state
    return nextState;
  }

  const foundIndex = state.children.findIndex(leaf => nextLeaf && leaf.key === nextLeaf.key);
  const foundNextLeaf = foundIndex > -1;

  if (foundNextLeaf) {
    const foundLeaf = state.children[foundIndex];
    // `nextLeaf` has one child, always. See `createState()`
    if (hasNextChild(nextLeaf)) {
      const nextAction: NavigationAction = {
        ...action,
        nextNavigationState: nextLeaf,
      };

      return {
        ...state,
        children: [
          ...state.children.slice(0, foundIndex),
          defaultReducer(foundLeaf, nextAction),
          ...state.children.slice(foundIndex + 1, state.children.length),
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
      children: [
        ...state.children.slice(0, foundIndex + 1),
      ],
      index: foundIndex,
      ...extractCapturedState(nextState),
    };
  }

  // Push a new child
  return {
    ...state,
    children: [
      ...state.children,
      nextLeaf,
    ],
    index: state.children.length,
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

export function createState(routes: any,
                            location: Location,
                            params: Object): EnhancedNavigationState {
  /* eslint-disable consistent-return */
  function reduceRoutes(prevState: EnhancedNavigationState,
                        currentRoute: RouteDef,
                        index: number,
                        allRoutes: Array<RouteDef>): EnhancedNavigationState {
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
        children: [],
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
          children: [prevState],
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

const canPop = (pos: number, state: EnhancedNavigationState) => {
  const index = state.index + pos;
  return index >= 0;
};

export function canPopActiveStack(n: number,
                               leafState: EnhancedNavigationState,
                               parentState: ?EnhancedNavigationState): ?Location {
  if (leafState.children && leafState.children.length > 0) {
    return canPopActiveStack(n, leafState.children[leafState.index], leafState);
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
    return parentState.children[popTo].location;
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

export function getActiveLocation(leafState: EnhancedNavigationState): ?Location {
  if (leafState.children && leafState.children.length > 0) {
    return getActiveLocation(leafState.children[leafState.index]);
  }

  return leafState.location;
}
