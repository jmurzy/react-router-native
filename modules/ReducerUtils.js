/* @flow */

import warning from 'warning';
import invariant from 'invariant';
import getRouteParams from 'react-router/es6/getRouteParams';
import type {
  EnhancedNavigationState,
  Location,
  RouteDef,
  IndexRouteDef,
  NoPathRouteDef,
} from './TypeDefinition';

const hasNextChild = leaf => leaf.children && leaf.children.length === 1;

const extractCapturedState = leaf => ({
  params: leaf.params,
  routeParams: leaf.routeParams,
  location: leaf.location,
});

function mergeState(oldLeaf: EnhancedNavigationState,
                    newLeaf: EnhancedNavigationState): EnhancedNavigationState {
  // `creteState()` always returns a unary tree
  const nextLeaf = newLeaf.children[0];

  if (!nextLeaf) {
    // Return `newLeaf` to reset state, or `oldLeaf` to maintain state
    return newLeaf;
  }

  const foundIndex = oldLeaf.children.findIndex(leaf => nextLeaf && leaf.key === nextLeaf.key);
  const foundNextLeaf = foundIndex > -1;

  if (foundNextLeaf) {
    const foundLeaf = oldLeaf.children[foundIndex];
    // `nextLeaf` has one child, always. See `createState()`
    if (hasNextChild(nextLeaf)) {
      return {
        ...oldLeaf,
        children: [
          ...oldLeaf.children.slice(0, foundIndex),
          mergeState(foundLeaf, nextLeaf),
          ...oldLeaf.children.slice(foundIndex + 1, oldLeaf.children.length),
        ],
        index: foundIndex,
        ...extractCapturedState(newLeaf),
      };
    }

    // nextLeaf is the final leaf (newleaf has no grandchild), update index and stop
    let leaf = {
      ...oldLeaf,
      children: [
        ...oldLeaf.children.slice(0, foundIndex),
        {
          ...foundLeaf,
          ...extractCapturedState(nextLeaf),
        },
        ...oldLeaf.children.slice(foundIndex + 1, oldLeaf.children.length),
      ],
      index: foundIndex,
      ...extractCapturedState(newLeaf),
    };

    // For stacks, when a location descriptor with the same key is pushed, it's assumed POP,
    // re-activate leaf and slice off the tail
    if (oldLeaf.type === 'stack') {
      leaf = {
        ...leaf,
        children: [
          ...oldLeaf.children.slice(0, foundIndex + 1),
        ],
      };
    }

    return leaf;
  }

  // Push a new child
  if (oldLeaf.type === 'stack' || oldLeaf.type === 'tabs') {
    return {
      ...oldLeaf,
      children: [
        ...oldLeaf.children,
        nextLeaf,
      ],
      index: oldLeaf.children.length,
      ...extractCapturedState(newLeaf),
    };
  }

  // Replace existing child
  return {
    ...oldLeaf,
    children: [
      nextLeaf,
    ],
    index: 0,
    ...extractCapturedState(newLeaf),
  };
}

// function isIndexRoute(route: Route): boolean {
//   if (!route.path && !route.childRoutes && !route.routeType) {
//     return true;
//   }
//   return false;
// }

// function isNoPathRoute(route: Route): boolean {
//   if (!route.path && route.childRoutes && route.routeType === 'single') {
//     return true;
//   }
//   return false;
// }

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
  if (!route.path && route.childRoutes && route.routeType === 'single') {
    return {
      childRoutes: route.childRoutes,
      component: route.component,
      overlayComponent: route.overlayComponent,
      routeType: route.routeType,
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

    if (parentRoute && parentRoute.routeType === 'stack') {
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
  if (parentState && parentState.type === 'stack') {
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

export function activateState(oldState: ?EnhancedNavigationState,
                              newState: EnhancedNavigationState): EnhancedNavigationState {
  if (!oldState) {
    return newState;
  }

  // Root swap
  if (oldState.path !== newState.path) {
    return newState;
  }

  return mergeState(oldState, newState);
}

export function getActiveRouteType(routes: Array<RouteDef>): ?string {
  if (routes && routes.length > 1) {
    return routes[routes.length - 2].routeType;
  }
  return null;
}
