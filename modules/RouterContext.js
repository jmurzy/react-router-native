/* @flow */

import React, { PropTypes, Component } from 'react';
import invariant from 'invariant';
import { Actions } from 'history';
import RootWrapper from './RootWrapper';
import reducer from './Reducer';
import { createNavigation, RouteTypes } from './RouteUtils';
import { getActiveLocation, getActiveParentRouteType, getActiveRouteType } from './ReducerUtils';
import type {
  Snapshot,
  RouteDef,
  Location,
  EnhancedNavigationState,
  ElementProvider,
  NavigationAction,
} from './TypeDefinition';

import match from 'react-router/es6/match';

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
  navState: EnhancedNavigationState,
  navigationTree: ?ReactElement,
};

let backwardHistory: Array<Snapshot> = [];
let forwardHistory: Array<Snapshot> = [];

const { POP: HISTORY_POP, REPLACE: HISTORY_REPLACE } = Actions;

const { TABS } = RouteTypes;

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
    const action: NavigationAction = { routes, location, params };
    const navState = reducer(null, action);

    (this: any).createElement = this.createElement.bind(this);

    const navigationTree = createNavigation(this.createElement, routes);

    this.state = { navState, navigationTree };
    backwardHistory.push(navState);
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

    const { navState } = this.state;
    const activeRouteType = getActiveParentRouteType(routes);

    const pop = createPop(navState);
    const transitionTo = createTransitionTo(location, activeRouteType);
    const push = createPush(location, activeRouteType);
    const replace = createReplace(location, activeRouteType);

    // TODO User defined listenBefore
    // TODO Explore a better react-router API to do this
    const unListenBefore = listenBefore((nextLocation, callback) => {
      // One-off per navState
      unListenBefore();

      const path = router.createPath(nextLocation);
      match({ location: path, routes }, (error, redirectLocation, nextState) => {
        if (!nextState) {
          callback(true);
          return;
        }

        const {
          routes: nextRoutes,
          params: nextParams,
        } = nextState;

        const action: NavigationAction = {
          routes: nextRoutes,
          location: nextLocation,
          params: nextParams,
        };

        const nextNavState = reducer(navState, action);

        const activeLocation = this.shouldRedirectToActiveRoute(
          nextRoutes,
          nextLocation,
          nextNavState
        );

        // if (activeLocation) debugger;

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

    let navState;

    // TODO Refactor snapshot tracking into `nativeHistory` with our own version of
    // `createMemoryHistory`
    if (nextLocation.action === HISTORY_POP) {
      // go(n/-n)
      let index = backwardHistory.findIndex(snapshot => snapshot.location.key === nextLocation.key);
      if (index >= 0) {
        // Moving backward
        navState = backwardHistory[index];
        const head = backwardHistory.splice(index + 1);
        forwardHistory = [...head, ...forwardHistory];
      } else {
        // Assume forward
        index = forwardHistory.findIndex(snapshot => snapshot.location.key === nextLocation.key);
        navState = forwardHistory[index];
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

      const action: NavigationAction = {
        routes: nextRoutes,
        location: nextLocation,
        params: nextParams,
        resetStack,
      };

      navState = reducer(this.state.navState, action);

      if (nextLocation.action === HISTORY_REPLACE) {
        backwardHistory[backwardHistory.length - 1] = navState;
      } else {
        backwardHistory.push(navState);
      }
    }

    const navigationTree = createNavigation(this.createElement, nextRoutes);

    this.setState({
      navState,
      navigationTree,
    });
  }

  shouldRedirectToActiveRoute(
    nextRoutes: Array<RouteDef>,
    nextLocation: Location,
    nextNavState: EnhancedNavigationState): ?Location {
    const nextActiveRouteType = getActiveRouteType(nextRoutes);
    // Terminating at tabs
    if (nextActiveRouteType === TABS) {
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
    const navState = this.state.navState;

    let element = null;
    if (navigationTree) {
      const props = {
        addressBar,
        navigationTree,
        navState,
        location,
      };

      element = this.createElement(RootWrapper, props);
    }

    invariant(
      element === null || element === false || React.isValidElement(element),
      'The root route must render a single element'
    );

    return element;
  }
}

export default RouterContext;
