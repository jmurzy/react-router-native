/* @flow */

import React, { Component, PropTypes } from 'react';
import { NavigationExperimental } from 'react-native';
import { warnOutOfSycn } from './warningUtil';
import withOnNavigate from './withOnNavigate';
import transitionRegistry from './transitionRegistry';
import { globalStyles as styles } from './styles';

import type { EnhancedNavigationRoute } from './TypeDefinition';

const {
  Card: NavgationCard,
  AnimatedView: NavigationTransitioner,
  PropTypes: NavigationPropTypes,
} = NavigationExperimental;

const {
  SceneRenderer: NavigationSceneRendererProps,
} = NavigationPropTypes;

type Props = {
  path: string,
  type: string,
  navigationComponent: ReactClass,
  overlayComponent: ?ReactClass,
  navigationScenes: ?Array<ReactElement>,
  navigationState: EnhancedNavigationRoute,
  onNavigate: Function,
};

class TabsRouteView extends Component<any, Props, any> {

  static propTypes = {
    path: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    navigationComponent: PropTypes.any.isRequired,
    overlayComponent: PropTypes.any,
    navigationScenes: PropTypes.arrayOf(PropTypes.element),
    navigationState: PropTypes.object,
    onNavigate: PropTypes.func.isRequired,
  };

  componentWillMount(): void {
    (this: any).renderCardScene = this.renderCardScene.bind(this);
    (this: any).renderScene = this.renderScene.bind(this);
    (this: any).renderOverlay = this.renderOverlay.bind(this);
  }

  renderOverlay(props: NavigationSceneRendererProps): ?ReactElement {
    const { scene } = props;

    const { navigationScenes } = this.props;
    if (!navigationScenes) {
      return null;
    }

    const navigationScene = navigationScenes.find(
      navScene => navScene.props.path === scene.route.path
    );

    if (!navigationScene) {
      warnOutOfSycn('Cannot render overlay', scene.route.path);
    }

    const overlayComponent = navigationScene.props.overlayComponent;
    if (overlayComponent) {
      const { location, params, routeParams } = scene.route;
      return React.createElement(overlayComponent, { ...props, location, params, routeParams });
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

    return (
      <NavgationCard
        key={scene.route.key}
        style={[viewStyle, styles.navigationCard]}
        panHandlers={panHandlers}
        {...props}
        renderScene={this.renderCardScene}
      />
    );
  }

  renderCardScene(props: NavigationSceneRendererProps): ?ReactElement {
    const { scene } = props;

    const { navigationScenes } = this.props;

    if (!navigationScenes) {
      return null;
    }

    const navigationScene = navigationScenes.find(
      navScene => navScene.props.path === scene.route.path
    );

    if (!navigationScene) {
      warnOutOfSycn('Cannot render card', scene.route.path);
    }

    return React.cloneElement(navigationScene, { navigationState: scene.route });
  }

  render(): ReactElement {
    const {
      onNavigate,
      navigationScenes,
      navigationState,
      navigationComponent: NavigationComponent,
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

    let wrappedChildren;
    if (navigationScenes && routes && routes.length > 0) {
      wrappedChildren = (
        <NavigationTransitioner
          configureTransition={configureTransition}
          applyAnimation={applyAnimation}
          style={styles.wrapper}
          navigationState={navigationState}
          renderScene={this.renderScene}
          renderOverlay={this.renderOverlay}
          onNavigate={onNavigate}
        />
      );
    }

    return (
      <NavigationComponent params={params} routeParams={routeParams} location={location}>
        {wrappedChildren}
      </NavigationComponent>
    );
  }

}

export default withOnNavigate(TabsRouteView);
