/* @flow */

import React, { Component, PropTypes } from 'react';

import { Actions } from 'history';

import { createRoutes } from 'react-router';
import { createRouterObject, assignRouterState } from 'react-router/es6/RouterUtils';
import createTransitionManager from 'react-router/es6/createTransitionManager';

import { createNavigationState } from './RouterUtils';
import { getActiveLocation, getActiveRouteType } from './ReducerUtils';

import RouterContext from './RouterContext';

import { RouteTypes } from './RouteUtils';

const { TABS_ROUTE } = RouteTypes;

const {
  POP: HISTORY_POP,
  REPLACE: HISTORY_REPLACE,
} = Actions;

import type {
  RouteDef,
  EnhancedNavigationRoute,
  Location,
  Snapshot,
} from './TypeDefinition';

type Props = {
  history: Object,
  children: ?Array<ReactElement>,
  routes: ?Array<RouteDef>,
  render: Function,
  createElement: ?Function,
  onError?: () => void,
  onUpdate?: () => void,
  matchContext: Object,
};

const route = PropTypes.oneOfType([PropTypes.object, PropTypes.element]);

let backwardHistory: Array<Snapshot> = [];
let forwardHistory: Array<Snapshot> = [];

class NativeRouter extends Component<any, any, any> {

  static propTypes = {
    history: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([route, PropTypes.arrayOf(route)]),
    routes: PropTypes.oneOfType([route, PropTypes.arrayOf(route)]),
    render: PropTypes.func.isRequired,
    createElement: PropTypes.func,
    onError: PropTypes.func,
    onUpdate: PropTypes.func,
    matchContext: PropTypes.object.isRequired,
  };

  static defaultProps = {
    render(props) {
      return <RouterContext {...props} />;
    },
    matchContext: {},
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      location: null,
      routes: null,
      params: null,
      components: null,
      navigationState: null,
    };

    const { routes, children } = props;

    this.routes = createRoutes(routes || children);
  }

  componentWillMount(): void {
    (this: any).handleError = this.handleError.bind(this);
    (this: any).createRouterObject = this.createRouterObject.bind(this);
    (this: any).createTransitionManager = this.createTransitionManager.bind(this);
    (this: any).shouldRedirectToActiveRoute = this.shouldRedirectToActiveRoute.bind(this);

    this.transitionManager = this.createTransitionManager();
    const {
      syncRouterState,
      ...router,
    } = this.createRouterObject(this.state);

    this.router = router;

    this._unlisten = this.transitionManager.listen((error, routerState) => {
      if (error) {
        this.handleError(error);
      } else {
        const { onUpdate } = this.props;

        assignRouterState(this.router, routerState);

        const {
          routes: nextRoutes,
          location: nextLocation,
        } = routerState;

        let navigationState;

        // TODO Refactor snapshot tracking into `nativeHistory` with our own version of
        // `createMemoryHistory`
        if (nextLocation.action === HISTORY_POP) {
          // go(n/-n)
          let index = backwardHistory.findIndex(
            snapshot => snapshot.location.key === nextLocation.key
          );
          if (index >= 0) {
            // Moving backward
            navigationState = backwardHistory[index];
            const head = backwardHistory.splice(index + 1);
            forwardHistory = [...head, ...forwardHistory];
          } else {
            // Assume forward
            index = forwardHistory.findIndex(
              snapshot => snapshot.location.key === nextLocation.key
            );
            navigationState = forwardHistory[index];
            const tail = forwardHistory.splice(0, index + 1);
            backwardHistory = [...backwardHistory, ...tail];
          }
        }

        if (!navigationState) {
          // Clear `forwardHistory`
          forwardHistory = [];

          navigationState = createNavigationState(this.state.navigationState, routerState);

          const activeLocation = this.shouldRedirectToActiveRoute(
            nextRoutes,
            nextLocation,
            navigationState,
          );

          if (activeLocation) {
            this.router.push(activeLocation);
            return;
          }

          if (nextLocation.action === HISTORY_REPLACE && !nextLocation.state.$routerReplace) {
            backwardHistory[backwardHistory.length - 1] = navigationState;
          } else {
            backwardHistory.push(navigationState);
          }
        }

        const state = {
          ...routerState,
          navigationState,
        };

        syncRouterState(state);
        this.setState(state, onUpdate);
      }
    });
  }

  componentWillUnmount(): void {
    if (this._unlisten) {
      this._unlisten();
    }
  }

  props: Props;
  routes: Array<RouteDef>;
  router: Object;
  _unlisten: ?Function;
  transitionManager: Object;

  shouldRedirectToActiveRoute(
    nextRoutes: Array<RouteDef>,
    nextLocation: Location,
    nextNavState: EnhancedNavigationRoute
  ): ?Location {
    const nextActiveRouteType = getActiveRouteType(nextRoutes);
    // Terminating at tabs
    if (nextActiveRouteType === TABS_ROUTE) {
      // Find location of the most active leaf
      const activeLocation = getActiveLocation(nextNavState);

      if (activeLocation) {
        const nextPath = this.router.createPath(nextLocation);
        const redirectPath = this.router.createPath(activeLocation);

        if (redirectPath !== nextPath) {
          return activeLocation;
        }
      }
    }

    return null;
  }

  handleError(error: any) {
    const onError = this.props;

    if (onError) {
      (onError: any).call(this, error);
    } else {
      throw error;
    }
  }

  createRouterObject(state: Object) {
    const {
      matchContext: {
        router: _router,
      },
    } = this.props;

    if (_router) {
      return _router;
    }

    const { history } = this.props;
    return createRouterObject(history, this.transitionManager, state);
  }

  createTransitionManager(): Object {
    const {
      matchContext: {
        transitionManager: _transitionManager,
      },
    } = this.props;

    if (_transitionManager) {
      return _transitionManager;
    }

    const { history } = this.props;
    return createTransitionManager(history, this.routes);
  }

  render(): ?ReactElement {
    const {
      location,
      routes: _routes,
      params,
      components,
      navigationState,
    } = this.state;

    const {
      createElement,
      render,
      ...passProps,
    } = this.props;

    if (location == null) {
      return null;
    }

    // React Router only forwards non-Router-specific props to routing context
    Object.keys(NativeRouter.propTypes).forEach(
      propType => delete passProps[propType]
    );

    return render({
      ...passProps,
      router: this.router,
      location,
      routes: _routes,
      params,
      components,
      navigationState,
      createElement,
      backwardHistory,
      forwardHistory,
    });
  }
}

export default NativeRouter;
