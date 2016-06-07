/* @flow */

import React, { Component, PropTypes } from 'react';
import { NavigationExperimental } from 'react-native';
import { warnOutOfSync } from './warningUtil';
import withOnNavigate from './withOnNavigate';
import transitionRegistry from './transitionRegistry';
import { globalStyles as styles } from './styles';

import type { EnhancedNavigationRoute } from './TypeDefinition';

const {
  Card: NavigationCard,
  AnimatedView: NavigationTransitioner,
  PropTypes: NavigationPropTypes,
} = NavigationExperimental;

const {
  SceneRenderer: NavigationSceneRendererProps,
} = NavigationPropTypes;

type Props = {
  path: string,
  type: string,
  component: ReactClass,
  overlayComponent: ?ReactClass,
  navigationalElements: ?Array<ReactElement>,
  navigationState: EnhancedNavigationRoute,
  createElement: Function,
  onNavigate: Function,
};

class TabsRouteView extends Component<any, Props, any> {

  static propTypes = {
    path: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    component: PropTypes.any.isRequired,
    overlayComponent: PropTypes.any,
    navigationalElements: PropTypes.arrayOf(PropTypes.element),
    navigationState: PropTypes.object,
    createElement: PropTypes.func.isRequired,
    onNavigate: PropTypes.func.isRequired,
  };

  componentWillMount(): void {
    (this: any).renderCardScene = this.renderCardScene.bind(this);
    (this: any).renderScene = this.renderScene.bind(this);
    (this: any).renderOverlay = this.renderOverlay.bind(this);
  }

  renderOverlay(props: NavigationSceneRendererProps): ?ReactElement {
    const { scene } = props;

    const { navigationalElements, createElement } = this.props;
    if (!navigationalElements) {
      return null;
    }

    const navigationalElement = navigationalElements.find(
      navScene => navScene.props.path === scene.route.path
    );

    if (!navigationalElement) {
      warnOutOfSync('Cannot render overlay', scene.route.path);
    }

    const overlayComponent = navigationalElement.props.overlayComponent;
    if (overlayComponent) {
      const { location, params, routeParams } = scene.route;

      const overlayComponentProps = {
        ...props,
        location,
        params,
        routeParams,
      };

      return createElement(overlayComponent, overlayComponentProps);
    }

    return null;
  }

  renderScene(props: NavigationSceneRendererProps): ?ReactElement {
    const { scene } = props;

    if (!scene.route) {
      return null;
    }

    const { transition: parentTransition } = props.navigationState;
    const { transition: sceneTransition } = scene.route;

    const transition = sceneTransition || parentTransition;

    const {
      styleInterpolator,
      panResponder,
    } = transitionRegistry[transition];

    const viewStyle = styleInterpolator(props);
    const panHandlers = panResponder(props);

    const navigationCardProps = {
      key: scene.route.key,
      style: [viewStyle, styles.navigationCard],
      panHandlers,
      ...props,
      renderScene: this.renderCardScene,
    };

    return React.createElement(NavigationCard, navigationCardProps);
  }

  renderCardScene(props: NavigationSceneRendererProps): ?ReactElement {
    const { scene } = props;

    const { navigationalElements } = this.props;

    if (!navigationalElements) {
      return null;
    }

    const navigationalElement = navigationalElements.find(
      navScene => navScene.props.path === scene.route.path
    );

    if (!navigationalElement) {
      warnOutOfSync('Cannot render card', scene.route.path);
    }

    return React.cloneElement(navigationalElement, { navigationState: scene.route });
  }

  render(): ReactElement {
    const {
      onNavigate,
      navigationalElements,
      navigationState,
      component,
      createElement,
    } = this.props;

    const {
      routes,
      params,
      routeParams,
      location,
      transition,
    } = navigationState;

    const {
      configureTransition,
      applyAnimation,
    } = transitionRegistry[transition];

    // Create NavigationTransitioner for handling nested routes
    let transitioner;
    if (navigationalElements && routes && routes.length > 0) {
      const transitionerProps = {
        configureTransition,
        applyAnimation,
        style: styles.wrapper,
        navigationState,
        renderScene: this.renderScene,
        renderOverlay: this.renderOverlay,
        onNavigate,
      };

      transitioner = React.createElement(NavigationTransitioner, transitionerProps);
    }

    const componentProps = {
      params,
      routeParams,
      location,
      children: transitioner,
    };

    return createElement(component, componentProps);
  }

}

export default withOnNavigate(TabsRouteView);
