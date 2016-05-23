import { /* NavigationExperimental, Animated, */Easing } from 'react-native';
import invariant from 'invariant';

// import type { EnhancedNavigationState, AnimatedValue } from './TypeDefinition';

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
  easing: Easing.inOut(Easing.ease),
};

function configureDefaultTransition() {
  // FIXME react-native/7db7f78dc7d2b85843707f75565bcfcb538e8e51#commitcomment-17575647
  return defaultTransitionSpec;
}

function configureSkipTransition() {
  return {
    duration: 0,
  };
}

// function skipAnimation(
//   position: AnimatedValue,
//   navigationState: EnhancedNavigationState,
// ): void {
//   position.setValue(navigationState.index);
// }

// function applyDefaultAnimation(
//   position: AnimatedValue,
//   navigationState: EnhancedNavigationState,
// ): void {
//   Animated.spring(
//     position,
//     {
//       bounciness: 0,
//       toValue: navigationState.index,
//     }
//   ).start();
// }

const noPanResponder = () => null;

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
