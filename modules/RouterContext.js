/* @flow */

import React, { PropTypes, Component } from 'react';
import invariant from 'invariant';
import { Actions } from 'history';
import RootWrapper from './RootWrapper';
import reducer from './Reducer';
import { createNavigation } from './RouteUtils';
import { canPopActiveStack, getActiveRouteType } from './ReducerUtils';
import type {
  Snapshot,
  RouteDef,
  Location,
  EnhancedNavigationState,
  ElementProvider,
  NavigationAction,
} from './TypeDefinition';

type Props = {
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
};

let backwardHistory: Array<Snapshot> = [];
let forwardHistory: Array<Snapshot> = [];

const { PUSH: HISTORY_PUSH, POP: HISTORY_POP, REPLACE: HISTORY_REPLACE } = Actions;

class RouterContext extends Component<any, any, any> {

  static propTypes= {
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

    this.state = { navState };
    backwardHistory.push(navState);
  }

  state: State;

  getChildContext(): Object {
    const {
      router: {
        transitionTo: baseTransitionTo,
        ...router,
      },
    } = this.props;

    const navState = this.state.navState;

    function pop(n = -1) {
      if (!n || n > -1) {
        return false;
      }

      const prevLocation = canPopActiveStack(n, navState);

      if (prevLocation) {
        const stateKey = prevLocation.state.stateKey;
        const location = router.createLocation(router.createPath(prevLocation), HISTORY_PUSH);
        location.state = { stateKey };

        baseTransitionTo(location);
        return true;
      }

      return false;
    }

    const transitionTo = (nextLocation) => {
      // History API treats HISTORY_PUSH to current path like HISTORY_REPLACE to be consistent with
      // browser behavior. (mjackson/history/blob/v2.0.1/modules/createHistory.js#L126) This is not
      // reasonable when performing `router.pop()` on <Stack />. A unique stateKey is needed for
      // each `location` to (1) bust the default 'HISTORY_REPLACE' behavior, (2) location objects
      // that are passed to reducer during a `pop` needs a stateKey to be able to use a previous
      // state for the newly HISTORY_PUSH'ed pointer to an older scene, (3) History needs a unique
      // `location.key` for each location entry. So cannot be used as stateKey.
      const location = nextLocation;
      const stateKey = router.createKey();
      location.state = { ...location.state, stateKey };

      if (location.action === HISTORY_PUSH) {
        const currentLocation = this.props.location;
        const currentPath = router.createPath(currentLocation);
        const nextPath = router.createPath(location);
        const currentStateKey = currentLocation.state.stateKey;
        const nextStateKey = location.state.stateKey;

        if (currentPath === nextPath && currentStateKey !== nextStateKey) {
          const routeType = getActiveRouteType(this.props.routes);
          if (routeType !== 'stack') {
            location.action = HISTORY_REPLACE;
          }
        }
      }

      baseTransitionTo(location);
    };

    const push = (input) => transitionTo(router.createLocation(input, HISTORY_PUSH));
    const replace = (input) => transitionTo(router.createLocation(input, HISTORY_REPLACE));

    const enhancedRouter = {
      ...router,
      transitionTo,
      push,
      replace,
      pop,
    };

    return { router: enhancedRouter, backwardHistory, forwardHistory };
  }

  componentWillMount(): void {
    (this: any).createElement = this.createElement.bind(this);
  }

  componentWillReceiveProps(nextProps: Props): void {
    const { routes, location, params } = nextProps;

    let navState;
    // go(n/-n)
    if (location.action === HISTORY_POP) {
      let index = backwardHistory.findIndex(snapshot => snapshot.location.key === location.key);
      if (index >= 0) {
        // Moving backward
        navState = backwardHistory[index];
        const head = backwardHistory.splice(index + 1);
        forwardHistory = [...head, ...forwardHistory];
      } else {
        // Assume forward
        index = forwardHistory.findIndex(snapshot => snapshot.location.key === location.key);
        navState = forwardHistory[index];
        const tail = forwardHistory.splice(0, index + 1);
        backwardHistory = [...backwardHistory, ...tail];
      }
    } else {
      // Clear `forwardHistory`
      forwardHistory = [];

      // TODO Double taps should reset stack
      let resetStack = false;
      if (location.action === HISTORY_REPLACE) {
        resetStack = true;
      }

      const action: NavigationAction = { routes, location, params, resetStack };
      navState = reducer(this.state.navState, action);

      if (location.action === HISTORY_REPLACE) {
        backwardHistory[backwardHistory.length - 1] = navState;
      } else {
        backwardHistory.push(navState);
      }
    }

    this.setState({
      navState,
    });
  }

  props: Props;

  createElement(component: ReactClass<any>, props: any): ?ReactElement {
    return component == null ? null : this.props.createElement(component, props);
  }

  render(): ?ReactElement {
    const { location, routes, addressBar } = this.props;

    const navigationTree = createNavigation(this.createElement, routes);
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
