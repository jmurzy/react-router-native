/* @flow */

import {
  canPopActiveStack,
  getActiveParentRouteType,
} from './ReducerUtils';
import { Actions } from 'history';
import { createMemoryHistory } from 'react-router';
import {
  createRandomKey,
  DEFAULT_KEY_LENGTH,
} from './LocationUtils';
import { RouteTypes } from './RouteUtils';

const { STACK_ROUTE } = RouteTypes;

const {
  PUSH: HISTORY_PUSH,
  REPLACE: HISTORY_REPLACE,
} = Actions;

let routerState = null;

const useNavState = (createHistory: Function) => (options = {}) => {
  const {
    transitionTo: baseTransitionTo,
    ...history,
  } = createHistory(options);

  const pop = (n = -1): boolean => {
    if (!routerState) {
      return false;
    }

    const {
      navigationState,
    } = routerState;

    if (!n || n > -1) {
      return false;
    }

    const prevLocation = canPopActiveStack(n, navigationState);

    if (prevLocation) {
      const stateKey = prevLocation.state.stateKey;
      const location = history.createLocation(history.createPath(prevLocation), HISTORY_PUSH);
      location.state = { stateKey };

      baseTransitionTo(location);
      return true;
    }

    return false;
  };

  const transitionTo = (nextLocation) => {
    // History API treats HISTORY_PUSH to current path like HISTORY_REPLACE to be consistent with
    // browser behavior. (mjackson/history/blob/v2.0.1/modules/createHistory.js#L126) This is not
    // reasonable when performing `router.pop()` on <StackRoute />. A unique stateKey is needed for
    // each `location` to:
    // 1. bust the default 'HISTORY_REPLACE' behavior,
    // 2. location objects that are passed to reducer during a `pop` needs a stateKey to be able to
    // use a previous state for the newly HISTORY_PUSH'ed pointer to an older scene,
    // 3. History needs a unique `location.key` for each location entry. So cannot be used as
    // stateKey.
    const location = nextLocation;
    const stateKey = history.createKey();
    location.state = { ...location.state, stateKey };

    // e.g `transitionTo` is invoked via transition hooks
    // TODO Normalize history behavior to remove $routerReplace
    if (location.action === HISTORY_REPLACE) {
      location.state = { ...location.state, $routerReplace: true };
    }

    if (routerState && location.action === HISTORY_PUSH) {
      const {
        location: currentLocation,
        routes: currentRoutes,
      } = routerState;

      const currentPath = history.createPath(currentLocation);
      const nextPath = history.createPath(location);
      const currentStateKey = currentLocation.state.stateKey;
      const nextStateKey = location.state.stateKey;

      if (currentPath === nextPath && currentStateKey !== nextStateKey) {
        const activeRouteType = getActiveParentRouteType(currentRoutes);

        if (activeRouteType !== STACK_ROUTE) {
          location.action = HISTORY_REPLACE;
        }
      }
    }

    baseTransitionTo(location);
  };

  const push = (input) =>
          transitionTo(history.createLocation(input, HISTORY_PUSH));

  const replace = (input) =>
          transitionTo(history.createLocation(input, HISTORY_REPLACE));

  const syncRouterState = (state) => {
    routerState = state;
  };

  return {
    ...history,
    transitionTo,
    pop,
    push,
    replace,
    syncRouterState,
  };
};

const stateKey = createRandomKey(DEFAULT_KEY_LENGTH);
const rootEntry = { pathname: '/', state: { stateKey } };
const entries = [rootEntry];
const nativeHistory = useNavState(createMemoryHistory)({
  entries,
  keyLength: DEFAULT_KEY_LENGTH,
});

export default nativeHistory;
