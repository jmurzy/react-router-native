import { /* NavigationExperimental, */ Animated, Easing } from 'react-native';
import invariant from 'invariant';

import type { EnhancedNavigationRoute, AnimatedValue } from './TypeDefinition';

/* eslint-disable no-multi-str */
import NavigationCardStackStyleInterpolator from 'react-native/Libraries/\
CustomComponents/NavigationExperimental/NavigationCardStackStyleInterpolator';
import NavigationPagerStyleInterpolator from 'react-native/Libraries/\
CustomComponents/NavigationExperimental/NavigationPagerStyleInterpolator';
import NavigationCardStackPanResponder from 'react-native/Libraries/\
CustomComponents/NavigationExperimental/NavigationCardStackPanResponder';
/* eslint-enable */

// NavigationExperimental/NavigationCardStackPanResponder.js#L68
const {
  Actions: {
    BACK: {
      type: PAN_RESPONDER_BACK_ACTION,
    },
  },
} = NavigationCardStackPanResponder;

export { PAN_RESPONDER_BACK_ACTION };

// FIXME react-native/14eb427a8061e0c904ace022535070150c6872d4#commitcomment-17574628
// const {
//   Card: NavgationCard,
// } = NavigationExperimental;
//
// const {
//   PagerStyleInterpolator: NavigationPagerStyleInterpolator,
//   CardStackStyleInterpolator: NavigationCardStackStyleInterpolator,
//   CardStackPanResponder: NavigationCardStackPanResponder,
// } = NavgationCard;

const transitionRegistry = {};

const defaultTransitionSpec = {
  duration: 250,
  // Similar to spring
  easing: Easing.elastic(0),
};

function configureDefaultTransition() {
  // FIXME react-native/7db7f78dc7d2b85843707f75565bcfcb538e8e51#commitcomment-17575647
  return defaultTransitionSpec;
}

function configureSkipTransition() {
  // The new Transitioner abstracts away the `AnimatedValue` so there is no way to `setValue` on
  // `position`
  return {
    duration: 0,
  };
}

// deprecated
function skipAnimation( // eslint-disable-line no-unused-vars
  position: AnimatedValue,
  navigationRoute: EnhancedNavigationRoute,
): void {
  position.setValue(navigationRoute.index);
}

// deprecated
function applyDefaultAnimation( // eslint-disable-line no-unused-vars
  position: AnimatedValue,
  navigationRoute: EnhancedNavigationRoute,
): void {
  Animated.spring(
    position,
    {
      bounciness: 0,
      toValue: navigationRoute.index,
    }
  ).start();
}

const noPanResponder = () => null;

function createApplyAnimation(transitionSpec: Object) {
  return (
    position: AnimatedValue,
    navigationRoute: EnhancedNavigationRoute,
  ): void => {
    Animated.timing(
      position,
      {
        ...transitionSpec,
        toValue: navigationRoute.index,
      }
    ).start();
  };
}

export function addHandler(
  key: string,
  styleInterpolator: Function,
  panResponder: ?Function,
  configureCustomTransition: ?Function
): void {
  invariant(
    styleInterpolator,
    'styleInterpolator is required for %s',
    `'${key}'`
  );

  let configureTransition = configureCustomTransition || configureDefaultTransition;

  if (configureCustomTransition === null) {
    configureTransition = configureSkipTransition;
  }

  transitionRegistry[key] = {
    styleInterpolator,
    panResponder: panResponder || noPanResponder,
    configureTransition,
    // Create Transitioner compatible API for AnimatedView until issues are sorted out
    // jmurzy/react-router-native/issues/3
    applyAnimation: createApplyAnimation(configureTransition()),
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
  NavigationPagerStyleInterpolator.forHorizontal,
);

addHandler(
  NONE,
  NavigationCardStackStyleInterpolator.forVertical,
  null,
  null,
);

export default transitionRegistry;
