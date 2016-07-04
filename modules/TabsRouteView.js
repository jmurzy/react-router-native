/* @flow */

import React, { Component, PropTypes } from 'react';
import { NavigationExperimental, View } from 'react-native';
import { warnOutOfSync } from './warningUtil';
import transitionRegistry from './transitionRegistry';
import { globalStyles as styles } from './styles';

import type {
  EnhancedNavigationRoute,
  PseudoElement,
} from './TypeDefinition';

const {
  Card: NavigationCard,
  Transitioner: NavigationTransitioner,
} = NavigationExperimental;

type Props = {
  path: string,
  type: string,
  component: ReactClass,
  overlayComponent: ?ReactClass,
  navigationSubtree: ?Array<PseudoElement>,
  navigationState: EnhancedNavigationRoute,
  createElement: Function,
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
  };

  componentWillMount(): void {
    (this: any).renderTransition = this.renderTransition.bind(this);
    (this: any).renderScene = this.renderScene.bind(this);
    (this: any).renderOverlay = this.renderOverlay.bind(this);
    (this: any).renderCardScene = this.renderCardScene.bind(this);
  }

  // $FlowFixMe NavigationSceneRendererProps
  renderOverlay(props): ?ReactElement {
    const { scene } = props;

    const { navigationSubtree, createElement } = this.props;
    if (!navigationSubtree) {
      return null;
    }

    const navigationalElement = navigationSubtree.find(
      child => child.props.path === scene.route.path
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

  // $FlowFixMe NavigationSceneRendererProps
  renderScene(props): ?ReactElement {
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

  // $FlowFixMe NavigationSceneRendererProps
  renderCardScene(props): ?ReactElement {
    const { scene } = props;

    const { navigationSubtree } = this.props;
    if (!navigationSubtree) {
      return null;
    }

    const pseudoElement = navigationSubtree.find(
      child => child.props.path === scene.route.path
    );

    if (!pseudoElement) {
      warnOutOfSync('Cannot render card', scene.route.path);
    }

    const { routeViewComponent, props: routeViewComponentProps } = pseudoElement;

    return React.createElement(
      routeViewComponent,
      {
        ...routeViewComponentProps,
        navigationState: scene.route,
      }
    );
  }

  // $FlowFixMe NavigationTransitionProps
  renderTransition(props): ReactElement<any> {
    const overlay = this.renderOverlay({
      ...props,
      scene: props.scene,
    });

    const scenes = props.scenes.map(
     scene => this.renderScene({
       ...props,
       scene,
     })
    );

    return (
      <View
        style={styles.wrapper}
      >
        <View
          style={styles.wrapper}
        >
          {scenes}
        </View>
        {overlay}
      </View>
    );
  }

  render(): ReactElement {
    const {
      navigationSubtree,
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
    if (navigationSubtree && routes && routes.length > 0) {
      const transitionerProps = {
        configureTransition,
        applyAnimation,
        style: styles.wrapper,
        navigationState,
        render: this.renderTransition,
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

export default TabsRouteView;
