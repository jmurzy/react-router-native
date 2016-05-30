/* @flow */

import { defaultReducer } from './ReducerUtils';
import type { EnhancedNavigationState, NavigationAction } from './TypeDefinition';

export default (
  state: ?EnhancedNavigationState,
  action: NavigationAction,
): EnhancedNavigationState => {
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
