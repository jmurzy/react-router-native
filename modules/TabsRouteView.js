/* @flow */

import React, { Component, PropTypes } from 'react';
import { NavigationExperimental } from 'react-native';
import { warnOutOfSycn } from './warningUtil';
import withOnNavigate from './withOnNavigate';
import transitionRegistry from './transitionRegistry';
import { globalStyles as styles } from './styles';

import type { EnhancedNavigationState } from './TypeDefinition';

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
  navScenes: ?Array<ReactElement>,
  _navigationState: EnhancedNavigationState,
  onNavigate: Function,
};

class TabsRouteView extends Component<any, Props, any> {

  static propTypes = {
    path: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    navigationComponent: PropTypes.any.isRequired,
    overlayComponent: PropTypes.any,
    navScenes: PropTypes.arrayOf(PropTypes.element),
    _navigationState: PropTypes.object,
    onNavigate: PropTypes.func.isRequired,
  };

  componentWillMount(): void {
    (this: any).renderCardScene = this.renderCardScene.bind(this);
    (this: any).renderScene = this.renderScene.bind(this);
    (this: any).renderOverlay = this.renderOverlay.bind(this);
  }

  renderOverlay(props: NavigationSceneRendererProps): ?ReactElement {
    const { scene } = props;

    const { navScenes } = this.props;
    if (!navScenes) {
      return null;
    }

    const el = navScenes.find(navScene => navScene.props.path === scene.navigationState.path);
    if (!el) {
      warnOutOfSycn('Cannot render overlay', props);
    }

    const overlayComponent = el.props.overlayComponent;
    if (overlayComponent) {
      const { location, params, routeParams } = scene.navigationState;
      return React.createElement(overlayComponent, { ...props, location, params, routeParams });
    }

    return null;
  }

  renderScene(props: NavigationSceneRendererProps): ?ReactElement {
    const { scene } = props;

    if (!scene.navigationState) {
      return null;
    }

    const { interpolator: parentInterpolator } = props.navigationState;
    const { interpolator: sceneInterpolator } = scene.navigationState;

    const interpolator = sceneInterpolator || parentInterpolator;

    const {
      styleInterpolator,
      panResponder,
    } = transitionRegistry[interpolator];

    const viewStyle = styleInterpolator(props);
    const panHandlers = panResponder(props);

    return (
      <NavgationCard
        key={scene.navigationState.key}
        style={[viewStyle, styles.navigationCard]}
        panHandlers={panHandlers}
        {...props}
        renderScene={this.renderCardScene}
      />
    );
  }

  renderCardScene(props: NavigationSceneRendererProps): ?ReactElement {
    const { scene } = props;

    const { navScenes } = this.props;

    if (!navScenes) {
      return null;
    }

    const el = navScenes.find(navScene => navScene.props.path === scene.navigationState.path);

    if (!el) {
      warnOutOfSycn('Cannot render card', props);
    }

    return React.cloneElement(el, { _navigationState: scene.navigationState });
  }

  render(): ReactElement {
    const {
      onNavigate,
      navScenes,
      _navigationState,
      navigationComponent: NavigationComponent,
    } = this.props;

    const {
      children,
      params,
      routeParams,
      location,
      interpolator,
    } = _navigationState;

    const {
      configureTransition,
      applyAnimation,
    } = transitionRegistry[interpolator];

    let wrappedChildren;
    if (navScenes && children && children.length > 0) {
      wrappedChildren = (
        <NavigationTransitioner
          configureTransition={configureTransition}
          applyAnimation={applyAnimation}
          style={styles.wrapper}
          navigationState={_navigationState}
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
