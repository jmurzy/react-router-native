/* @flow */

import { activateState, createState } from './ReducerUtils';
import type { EnhancedNavigationState, NavigationAction } from './TypeDefinition';

export default (state: ?EnhancedNavigationState,
                { routes, location, params }: NavigationAction): EnhancedNavigationState => {
  const leafState = createState(routes, location, params);
  const newState = activateState(state, leafState);

  return newState;
};
