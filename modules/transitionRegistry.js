import {
  Animated,
  NavigationExperimental,
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
  bounciness: 0,
  duration: undefined,
  easing: undefined,
  timing: Animated.spring,
  useNativeDriver: true,
};

function configureDefaultTransition() {
  return defaultTransitionSpec;
}

const noAnimation = (value, config) => ({
  start(callback) {
    const setValue = () => {
      value.setValue(config.toValue);

      const result = {
        finished: true,
      };

      if (callback) {
        callback(result);
      }
    };

    setTimeout(setValue);
  },
  stop: () => {
    value.stopAnimation();
  },
});

function configureSkipTransition() {
  return {
    duration: undefined,
    easing: undefined,
    timing: noAnimation,
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
  NavigationCardStackStyleInterpolator.forHorizontal,
  null,
  null,
);

export default transitionRegistry;
