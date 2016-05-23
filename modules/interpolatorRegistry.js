import { NavigationExperimental, Animated } from 'react-native';
import invariant from 'invariant';

import type { EnhancedNavigationState, AnimatedValue } from './TypeDefinition';

const {
  Card: NavgationCard,
} = NavigationExperimental;

const {
  PagerStyleInterpolator: NavgationPagerStyleInterpolator,
  CardStackStyleInterpolator: NavigationCardStackStyleInterpolator,
  CardStackPanResponder: NavigationCardStackPanResponder,
} = NavgationCard;

const interpolatorRegistry = {};

function skipAnimation(
  position: AnimatedValue,
  navigationState: EnhancedNavigationState,
): void {
  position.setValue(navigationState.index);
}

const noPanResponder = () => null;

function applyDefaultAnimation(
  position: AnimatedValue,
  navigationState: EnhancedNavigationState,
): void {
  Animated.spring(
    position,
    {
      bounciness: 0,
      toValue: navigationState.index,
    }
  ).start();
}

export function addHandler(
  key: string,
  styleInterpolator: Function,
  panResponder: ?Function,
  applyCustomAnimation: ?Function
): void {
  invariant(
    styleInterpolator,
    'styleInterpolator is required for %s',
    `'${key}'`
  );

  let applyAnimation = applyCustomAnimation || applyDefaultAnimation;

  if (applyCustomAnimation === null) {
    applyAnimation = skipAnimation;
  }

  interpolatorRegistry[key] = {
    styleInterpolator,
    panResponder: panResponder || noPanResponder,
    applyAnimation,
  };
}

export const VERTICAL_CARD_STACK = 'vertical-card-stack';
export const HORIZONTAL_CARD_STACK = 'horizontal-card-stack';
export const HORIZONTAL_PAGER = 'horizontal-pager';
export const NONE = 'none';

addHandler(
  VERTICAL_CARD_STACK,
  NavigationCardStackStyleInterpolator.forVertical,
  NavigationCardStackPanResponder.forVertical
);

addHandler(
  HORIZONTAL_CARD_STACK,
  NavigationCardStackStyleInterpolator.forHorizontal,
  NavigationCardStackPanResponder.forHorizontal,
);

addHandler(
  HORIZONTAL_PAGER,
  NavgationPagerStyleInterpolator.forHorizontal,
);

addHandler(
  NONE,
  NavigationCardStackStyleInterpolator.forVertical,
  null,
  null,
);

export default interpolatorRegistry;
