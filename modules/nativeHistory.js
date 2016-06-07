/* @flow */

import { canPopActiveStack } from './ReducerUtils';
import { Actions } from 'history';

import { createMemoryHistory } from 'react-router';
import { DEFAULT_KEY_LENGTH, createRandomKey } from './LocationUtils';

import { RouteTypes } from './RouteUtils';

const { STACK_ROUTE } = RouteTypes;

import type {
  Location,
  RouteType,
  EnhancedNavigationRoute,
} from './TypeDefinition';

const { PUSH: HISTORY_PUSH, REPLACE: HISTORY_REPLACE } = Actions;

const useNavState = (createHistory: Function) => (options = {}) => {
  const {
    replace: baseReplace,
    push: basePush,
    transitionTo: baseTransitionTo,
    ...history,
  } = createHistory(options);

  const createPop = (navigationState: EnhancedNavigationRoute) => (n = -1) => {
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

  const createTransitionTo = (currentLocation, activeRouteType: RouteType) => (nextLocation) => {
    // History API treats HISTORY_PUSH to current path like HISTORY_REPLACE to be consistent with
    // browser behavior. (mjackson/history/blob/v2.0.1/modules/createHistory.js#L126) This is not
    // reasonable when performing `router.pop()` on <StackRoute />. A unique stateKey is needed
    // for each `location` to (1) bust the default 'HISTORY_REPLACE' behavior, (2) location
    // objects that are passed to reducer during a `pop` needs a stateKey to be able to use a
    // previous state for the newly HISTORY_PUSH'ed pointer to an older scene, (3) History needs a
    // unique `location.key` for each location entry. So cannot be used as stateKey.
    const nLocation = nextLocation;
    const stateKey = history.createKey();
    nLocation.state = { ...nLocation.state, stateKey };

    if (nLocation.action === HISTORY_PUSH) {
      const currentPath = history.createPath(currentLocation);
      const nextPath = history.createPath(nLocation);
      const currentStateKey = currentLocation.state.stateKey;
      const nextStateKey = nLocation.state.stateKey;

      if (currentPath === nextPath && currentStateKey !== nextStateKey) {
        if (activeRouteType !== STACK_ROUTE) {
          nLocation.action = HISTORY_REPLACE;
        }
      }
    }

    baseTransitionTo(nLocation);
  };

  const createPush = (currentLocation: Location, activeRouteType: RouteType) => (input) =>
          createTransitionTo(currentLocation,
                             activeRouteType)(history.createLocation(input, HISTORY_PUSH));

  const createReplace = (currentLocation: Location, activeRouteType: RouteType) => (input) =>
          createTransitionTo(currentLocation,
                             activeRouteType)(history.createLocation(input, HISTORY_REPLACE));

  return {
    ...history,
    baseTransitionTo,
    basePush,
    baseReplace,
    createTransitionTo,
    createPop,
    createPush,
    createReplace,
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
