import reducer from './Reducer';
import {
  Actions,
} from 'history';
import {
  createPartialState,
  LOCATION_CHANGE,
} from './ReducerUtils';

import type {
  EnhancedNavigationRoute,
  NavigationAction,
} from './TypeDefinition';

const {
  REPLACE: HISTORY_REPLACE,
} = Actions;

export function createNavigationState(
  navigationState: EnhancedNavigationRoute,
  routerState
): EnhancedNavigationRoute {
  const {
    routes,
    location,
    params,
  } = routerState;
  const nextNavigationState = createPartialState(routes, location, params);
  const type = LOCATION_CHANGE;

  // TODO Double taps should reset stack
  let resetStack = false;
  if (location.action === HISTORY_REPLACE) {
    resetStack = true;
  }

  const action: NavigationAction = {
    type,
    routes,
    location,
    params,
    nextNavigationState,
    resetStack,
  };

  return reducer(navigationState, action);
}
