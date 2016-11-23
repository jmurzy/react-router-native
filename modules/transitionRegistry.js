import {
  Animated,
  Easing,
  NativeModules,
  NavigationExperimental,
  Platform,
} from 'react-native';
import invariant from 'invariant';
import { warnOnce } from './warningUtil';

const {
  Card: NavigationCard,
} = NavigationExperimental;

const {
  PagerStyleInterpolator: NavigationPagerStyleInterpolator,
  CardStackStyleInterpolator: NavigationCardStackStyleInterpolator,
  CardStackPanResponder: NavigationCardStackPanResponder,
} = NavigationCard;

const transitionRegistry = {};

const hasNativeDriver = !!NativeModules.NativeAnimatedModule;

// FIXME `Animated.setValue` via NativeAnimated for iOS is buggy and causes
// panResponders to fail.
// Also See facebook/react-native#9729
const useNativeDriver = Platform.OS === 'android' ? hasNativeDriver : false;

const defaultTransitionSpec = {
  duration: 250,
  easing: Easing.inOut(Easing.ease),
  timing: Animated.timing,
  useNativeDriver,
};

function configureDefaultTransition() {
  warnOnce(
    Platform.OS === 'ios' || useNativeDriver,
    'Native animated module is not available. You may experience performance issues ' +
    'with transition animations since they will be performed on the JavaScript thread.'
  );
  return defaultTransitionSpec;
}

const noAnimation = (value, config) => ({
  start(callback) {
    value.setValue(config.toValue);

    const result = {
      finished: true,
    };

    if (callback) {
      callback(result);
    }
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
export const VERTICAL_PAGER = 'vertical-pager';
export const HORIZONTAL_CARD_STACK = 'horizontal-card-stack';
export const HORIZONTAL_PAGER = 'horizontal-pager';
export const NONE = 'none';

addHandler(
  VERTICAL_CARD_STACK,
  NavigationCardStackStyleInterpolator.forVertical,
  NavigationCardStackPanResponder.forVertical
);

addHandler(
  VERTICAL_PAGER,
  NavigationCardStackStyleInterpolator.forVertical
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
