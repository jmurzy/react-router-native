import {
  NavigationExperimental,
  Easing,
} from 'react-native';
import invariant from 'invariant';

const {
  Card: NavigationCard,
} = NavigationExperimental;

const {
  PagerStyleInterpolator: NavigationPagerStyleInterpolator,
  CardStackStyleInterpolator: NavigationCardStackStyleInterpolator,
  CardStackPanResponder: NavigationCardStackPanResponder,
} = NavigationCard;

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
  // `position` See facebook/react-native#8306
  return {
    duration: 0.000000001,
    easing: Easing.linear,
  };
}

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
