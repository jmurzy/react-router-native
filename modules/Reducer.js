/* @flow */

import { defaultReducer } from './ReducerUtils';
import type { EnhancedNavigationRoute, NavigationAction } from './TypeDefinition';

export default (
  state: ?EnhancedNavigationRoute,
  action: NavigationAction,
): EnhancedNavigationRoute => {
  const { nextNavigationState } = action;

  if (!state) {
    return nextNavigationState;
  }

  // Root swap
  if (state.path !== nextNavigationState.path) {
    return nextNavigationState;
  }

  return defaultReducer(state, action);
};
