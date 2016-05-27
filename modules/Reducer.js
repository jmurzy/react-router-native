/* @flow */

import { mergeState } from './ReducerUtils';
import type { EnhancedNavigationState, NavigationAction } from './TypeDefinition';

export default (
  oldState: ?EnhancedNavigationState,
  { nextNavigationState }: NavigationAction,
): EnhancedNavigationState => {
  if (!oldState) {
    return nextNavigationState;
  }

  // Root swap
  if (oldState.path !== nextNavigationState.path) {
    return nextNavigationState;
  }

  // TODO change margeState signature to (EnhancedNavigationState, NavigationAction)
  return mergeState(oldState, nextNavigationState);
};
