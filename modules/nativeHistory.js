/* @flow */
import { Actions } from 'history';

import {
  canPopActiveStack,
  getActiveParentRouteType,
} from './ReducerUtils';
import createMemoryHistory from './createMemoryHistory';
import { RouteTypes } from './RouteUtils';

const { STACK_ROUTE } = RouteTypes;

const {
  PUSH: HISTORY_PUSH,
  REPLACE: HISTORY_REPLACE,
} = Actions;

let routerState = null;

/* eslint-disable max-len */
/**
 * This enhances a given history
 * (see https://github.com/ReactJSTraining/history/blob/master/docs/Glossary.md#createhistoryenhancer )
 * by adding the methods `create(Pop|TransitionTo|Push|Replace)`.
 * These are used in RouterContext::getChildContext to produce the actual methods (`pop`, `transitionTo` etc.)
 * with closured information about the current routing state
 * (e.g. the current `navigationState` or `location`)
 */
/* eslint-enable max-len */
const useNavState = (createHistory: Function) => (options = {}) => {
  const {
    transitionTo: baseTransitionTo,
    ...history
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
      // FIXME move `stateKey` management into `history/nativeHistory`
      const stateKey = prevLocation.state ? prevLocation.state.stateKey : 0;
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
      const currentStateKey = currentLocation.state ? currentLocation.state.stateKey : 0;
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

const rootEntry = { pathname: '/' };
const entries = [rootEntry];
const nativeHistory = useNavState(createMemoryHistory)({ entries });

export default nativeHistory;
