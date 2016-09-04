/* @flow */
import { Animated } from 'react-native';

export type {
  NavigationTransitionProps,
  NavigationSceneRendererProps,
} from 'react-native/Libraries/NavigationExperimental/NavigationTypeDefinition';

export type RouteType = '<Route>' | '<StackRoute>' | '<TabsRoute>';

export type AnimatedValue = Animated.Value;

export type Location = {
  action: string,
  hash: string,
  key: string,
  pathName: string,
  query: Object,
  search: string,
  state: Object,
};

export type EnhancedNavigationRoute = {
  key: string,
  index: number,
  routes: Array<EnhancedNavigationRoute>,
  type: string,
  path: string,
  location: Location,
  params: Object,
  routeParams: Object,
  transition: ?string,
  reducer: Function,
  onSwipeBack: ?Function,
  onSwipeForward: ?Function,
};

export type RouteDef = {
  childRoutes: ?Array<RouteDef>,
  component: Function,
  overlayComponent: ?Function,
  path: ?string,
  routeType: ?RouteType,
  transition: ?string,
  reducer: Function,
  onSwipeBack: ?Function,
  onSwipeForward: ?Function,
};

export type IndexRouteDef = {
  component: Function,
  overlayComponent: ?Function,
};

export type NoPathRouteDef = {
  childRoutes: Array<RouteDef>,
  component: Function,
  overlayComponent: ?Function,
  routeType: RouteType,
};

export type ElementProvider = (component: ReactClass<any>, props: any) => ?ReactElement<any>;

export type NavigationAction = {
  type: string,
  routes: Array<RouteDef>,
  location: Location,
  params: Object,
  nextNavigationState: EnhancedNavigationRoute,
}

export type Snapshot = EnhancedNavigationRoute;

export type PseudoElement = {
  routeViewComponent: Object,
  props: Object,
};
