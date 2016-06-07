/* @flow */

import React, { Component, PropTypes } from 'react';
import { NavigationExperimental } from 'react-native';
import { warnOutOfSync } from './warningUtil';
import withOnNavigate from './withOnNavigate';
import { globalStyles as styles } from './styles';

import type { EnhancedNavigationRoute } from './TypeDefinition';

const {
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
  navigationalElements: ?Array<ReactElement>,
  navigationState: EnhancedNavigationRoute,
  createElement: Function,
  onNavigate: Function,
};

class RouteView extends Component<any, Props, any> {

  static propTypes = {
    path: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    component: PropTypes.any.isRequired,
    navigationalElements: PropTypes.arrayOf(PropTypes.element),
    navigationState: PropTypes.object,
    createElement: PropTypes.func.isRequired,
    onNavigate: PropTypes.func.isRequired,
  };

  componentWillMount(): void {
    (this: any).renderScene = this.renderScene.bind(this);
  }

  renderScene(props: NavigationSceneRendererProps): ?ReactElement {
    const { scene } = props;

    const { navigationalElements } = this.props;

    if (!scene.route || !navigationalElements) {
      return null;
    }

    const navigationalElement = navigationalElements.find(
      navScene => navScene.props.path === scene.route.path
    );

    if (!navigationalElement) {
      warnOutOfSync('Cannot render scene', scene.route.path);
    }

    const key = scene.route.key;

    return React.cloneElement(navigationalElement, { key, navigationState: scene.route });
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
    } = navigationState;

    // Create NavigationTransitioner for handling nested routes
    let transitioner;
    if (navigationalElements && routes && routes.length > 0) {
      // react-native/c3714d7ed7c8ee57e005d51147820456ef8cda3e
      // FIXME Replace `Transitioner` with `View` to reclaim performance
      const transitionerProps = {
        style: styles.wrapper,
        navigationState,
        renderScene: this.renderScene,
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

export default withOnNavigate(RouteView);
