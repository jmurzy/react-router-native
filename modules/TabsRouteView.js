/* @flow */

import React, { Component, PropTypes } from 'react';
import { NavigationExperimental } from 'react-native';
import { warnOutOfSync } from './warningUtil';
import withOnNavigate from './withOnNavigate';
import transitionRegistry from './transitionRegistry';
import { globalStyles as styles } from './styles';

import type {
  EnhancedNavigationRoute,
  PseudoElement,
} from './TypeDefinition';

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
  navigationSubtree: ?Array<PseudoElement>,
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
    navigationSubtree: PropTypes.arrayOf(PropTypes.object),
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

    const { navigationSubtree, createElement } = this.props;
    if (!navigationSubtree) {
      return null;
    }

    console.log('RouterNative.TabsRouteView.renderOverlay');
    console.log('RouterNative.TabsRouteView.renderOverlay.navigationSubtree', navigationSubtree);
    console.log('RouterNative.TabsRouteView.renderOverlay.scene', scene);
    console.log('RouterNative.TabsRouteView.renderOverlay.props', props);

    const navigationalElement = navigationSubtree.find(
      child => child.props.routerProps.path === scene.route.path
    );
    console.log('RouterNative.TabsRouteView.renderOverlay.navigationalElement', navigationalElement);

    if (!navigationalElement) {
      console.error(new Error('out of sync').stack);
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
      console.log('RouterNative.TabsRouteView.renderOverlay.createElement', overlayComponent);
      console.log('RouterNative.TabsRouteView.renderOverlay.createElement.props', overlayComponentProps);

      return createElement(overlayComponent, overlayComponentProps);
      console.log('RouterNative.TabsRouteView.renderOverlay.createElement.return');
    }

    return null;
  }

  renderScene(props: NavigationSceneRendererProps): ?ReactElement {
    console.log('RouterNative.TabsRouteView.renderScene');
    console.log('RouterNative.TabsRouteView.renderScene.props', props);
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
    console.log('RouterNative.TabsRouteView.renderScene.key', scene.route.key);

    const element = React.createElement(NavigationCard, navigationCardProps);
    console.log('RouterNative.TabsRouteView.renderScene.return', element);
    return element;
  }

  renderCardScene(props: NavigationSceneRendererProps): ?ReactElement {
    console.log('RouterNative.TabsRouteView.renderCardScene');
    console.log('RouterNative.TabsRouteView.renderCardScene.props', props);
    const { scene } = props;

    const { navigationSubtree } = this.props;
    console.log('RouterNative.TabsRouteView.renderCardScene.scene', scene);

    if (!navigationSubtree) {
      return null;
    }

    const pseudoElement = navigationSubtree.find(
      child => child.props.routerProps.path === scene.route.path
    );
    console.log('RouterNative.TabsRouteView.renderCardScene.pseudoElement', pseudoElement);

    if (!pseudoElement) {
      warnOutOfSync('Cannot render card', scene.route.path);
    }
    console.log('RouterNative.TabsRouteView.renderCardScene.cloneElement', pseudoElement);
    console.log('RouterNative.TabsRouteView.renderCardScene.cloneElement.props', { navigationState: scene.route });

    const { routeViewComponent, props: routeViewComponentProps } = pseudoElement;

    const element = React.createElement(
      routeViewComponent,
      {
        ...routeViewComponentProps,
        navigationState: scene.route,
      }
    );
    console.log('RouterNative.TabsRouteView.renderCardScene.cloneElement.return', element);
    return element;
  }

  getComponentProps() {
    const {
      path,
      type,
      component,
      overlayComponent,
      navigationSubtree,
      navigationState,
      createElement,
      onNavigate,
      ...rest,
    } = this.props;
    return rest;
  }

  render(): ReactElement {
    const {
      onNavigate,
      navigationSubtree,
      navigationState,
      component,
      createElement,
    } = this.props;

    console.log('RouterNative.TabsRouteView.render');
    console.log('RouterNative.TabsRouteView.render.props', this.props);
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
    if (navigationSubtree && routes && routes.length > 0) {
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

    console.log('RouterNative.TabsRouteView.render.wrappedChildren', wrappedChildren);

    console.log('RouterNative.TabsRouteView.render.component', component);
    const componentProps = {
      ...this.getComponentProps(),
      params,
      routeParams,
      location,
      children: transitioner,
    };
    console.log('RouterNative.TabsRouteView.render.component.props', componentProps);

    const element = createElement(component, componentProps);
    console.log('RouterNative.TabsRouteView.render.return', element);
    return element;
  }

}

export default withOnNavigate(TabsRouteView);
