/* @flow */

import React, { PropTypes, Component } from 'react';
import { match } from 'react-router';
import invariant from 'invariant';
import { Actions } from 'history';
import RootWrapper from './RootWrapper';
import reducer from './Reducer';
import { createNavigation, RouteTypes } from './RouteUtils';
import {
  getActiveLocation,
  getActiveParentRouteType,
  getActiveRouteType,
  createState,
  LOCATION_CHANGE,
} from './ReducerUtils';
import type {
  Snapshot,
  RouteDef,
  Location,
  EnhancedNavigationRoute,
  ElementProvider,
  NavigationAction,
  PseudoElement,
} from './TypeDefinition';

type Props = {
  allRoutes: Array<RouteDef>,
  router: Object,
  location: Location,
  routes: Array<RouteDef>,
  params: Object,
  components: Array<ReactClass>,
  createElement: ElementProvider,
  addressBar: boolean,
};

type State = {
  navigationState: EnhancedNavigationRoute,
  navigationTree: ?PseudoElement,
};

let backwardHistory: Array<Snapshot> = [];
let forwardHistory: Array<Snapshot> = [];

const {
  POP: HISTORY_POP,
  REPLACE: HISTORY_REPLACE,
} = Actions;

const { TABS_ROUTE } = RouteTypes;

class RouterContext extends Component<any, any, any> {

  static propTypes= {
    allRoutes: PropTypes.array.isRequired,
    router: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    routes: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    components: PropTypes.array.isRequired,
    createElement: PropTypes.func.isRequired,
    addressBar: PropTypes.bool,
  };

  static defaultProps = {
    createElement: React.createElement,
  };

  static childContextTypes = {
    router: PropTypes.object.isRequired,
    backwardHistory: PropTypes.array.isRequired,
    forwardHistory: PropTypes.array.isRequired,
  };

  constructor(props: Props) {
    super(props);
    const { routes, location, params } = props;
    const nextNavigationState = createState(routes, location, params);
    const action: NavigationAction = {
      type: LOCATION_CHANGE,
      routes,
      location,
      params,
      nextNavigationState,
    };
    const navigationState = reducer(null, action);

    (this: any).createElement = this.createElement.bind(this);

    const navigationTree = createNavigation(this.createElement, routes);

    this.state = { navigationState, navigationTree };
    backwardHistory.push(navigationState);
  }

  state: State;

  getChildContext(): Object {
    const {
      router: {
        createPop,
        createTransitionTo,
        createPush,
        createReplace,
        listenBefore,
        ...router,
      },
      location,
      routes,
    } = this.props;

    const { navigationState } = this.state;
    const activeRouteType = getActiveParentRouteType(routes);

    const pop = createPop(navigationState);
    const transitionTo = createTransitionTo(location, activeRouteType);
    const push = createPush(location, activeRouteType);
    const replace = createReplace(location, activeRouteType);

    // TODO User defined listenBefore
    // TODO Explore a better react-router API to do this
    const unListenBefore = listenBefore((nextLocation, callback) => {
      // One-off per navigationState
      unListenBefore();

      const path = router.createPath(nextLocation);
      match({ location: path, routes }, (error, redirectLocation, nextState) => {
        if (redirectLocation) {
          callback(false);
          push(redirectLocation);
          return;
        }

        if (!nextState) {
          callback(true);
          return;
        }

        const {
          routes: nextRoutes,
          params: nextParams,
        } = nextState;

        const nextNavigationState = createState(nextRoutes, nextLocation, nextParams);

        const action: NavigationAction = {
          type: LOCATION_CHANGE,
          routes: nextRoutes,
          location: nextLocation,
          params: nextParams,
          nextNavigationState,
        };

        const nextNavState = reducer(navigationState, action);

        const activeLocation = this.shouldRedirectToActiveRoute(
          nextRoutes,
          nextLocation,
          nextNavState
        );

        if (!activeLocation) {
          callback(true);
        } else {
          callback(false);
          push(activeLocation);
        }
      });
    });

    const enhancedRouter = {
      ...router,
      transitionTo,
      pop,
      push,
      replace,
    };

    return { router: enhancedRouter, backwardHistory, forwardHistory };
  }

  componentWillMount(): void {
    (this: any).shouldRedirectToActiveRoute = this.shouldRedirectToActiveRoute.bind(this);
  }

  componentWillReceiveProps(nextProps: Props): void {
    const { routes: nextRoutes,
            location: nextLocation,
            params: nextParams,
          } = nextProps;

    let navigationState;

    // TODO Refactor snapshot tracking into `nativeHistory` with our own version of
    // `createMemoryHistory`
    if (nextLocation.action === HISTORY_POP) {
      // go(n/-n)
      let index = backwardHistory.findIndex(snapshot => snapshot.location.key === nextLocation.key);
      if (index >= 0) {
        // Moving backward
        navigationState = backwardHistory[index];
        const head = backwardHistory.splice(index + 1);
        forwardHistory = [...head, ...forwardHistory];
      } else {
        // Assume forward
        index = forwardHistory.findIndex(snapshot => snapshot.location.key === nextLocation.key);
        navigationState = forwardHistory[index];
        const tail = forwardHistory.splice(0, index + 1);
        backwardHistory = [...backwardHistory, ...tail];
      }
    } else {
      // Clear `forwardHistory`
      forwardHistory = [];

      // TODO Double taps should reset stack
      let resetStack = false;
      if (nextLocation.action === HISTORY_REPLACE) {
        resetStack = true;
      }

      const nextNavigationState = createState(nextRoutes, nextLocation, nextParams);

      const action: NavigationAction = {
        type: LOCATION_CHANGE,
        routes: nextRoutes,
        location: nextLocation,
        params: nextParams,
        nextNavigationState,
        resetStack,
      };

      navigationState = reducer(this.state.navigationState, action);

      if (nextLocation.action === HISTORY_REPLACE && !nextLocation.state.$routerReplace) {
        backwardHistory[backwardHistory.length - 1] = navigationState;
      } else {
        backwardHistory.push(navigationState);
      }
    }

    const navigationTree = createNavigation(this.createElement, nextRoutes);

    this.setState({
      navigationState,
      navigationTree,
    });
  }

  shouldRedirectToActiveRoute(
    nextRoutes: Array<RouteDef>,
    nextLocation: Location,
    nextNavState: EnhancedNavigationRoute): ?Location {
    const nextActiveRouteType = getActiveRouteType(nextRoutes);
    // Terminating at tabs
    if (nextActiveRouteType === TABS_ROUTE) {
      // Find location of the most active leaf
      const activeLocation = getActiveLocation(nextNavState);

      if (activeLocation) {
        const { router } = this.props;

        const nextPath = router.createPath(nextLocation);
        const redirectPath = router.createPath(activeLocation);

        if (redirectPath !== nextPath) {
          return activeLocation;
        }
      }
    }

    return null;
  }

  props: Props;

  createElement(component: ReactClass<any>, props: any): ?ReactElement {
    return component == null ? null : this.props.createElement(component, props);
  }

  render(): ?ReactElement {
    const { location, addressBar } = this.props;

    const navigationTree = this.state.navigationTree;
    const navigationState = this.state.navigationState;

    let element = null;
    if (navigationTree) {
      const props = {
        addressBar,
        navigationTree,
        navigationState,
        location,
        route: {}, // TODO
        routes: this.props.routes,
      };

      element = React.createElement(RootWrapper, props);
    }

    invariant(
      element === null || element === false || React.isValidElement(element),
      'The root route must render a single element'
    );

    return element;
  }
}

export default RouterContext;
