/* @flow */

import React, { Component, PropTypes } from 'react';
import { NavigationExperimental } from 'react-native';
import { warnOutOfSync } from './warningUtil';
import withOnNavigate from './withOnNavigate';
import { globalStyles as styles } from './styles';

import type {
  EnhancedNavigationRoute,
  PseudoElement,
} from './TypeDefinition';

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
  navigationSubtree: ?Array<PseudoElement>,
  navigationState: EnhancedNavigationRoute,
  createElement: Function,
  onNavigate: Function,
};

class RouteView extends Component<any, Props, any> {

  static propTypes = {
    path: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    component: PropTypes.any.isRequired,
    navigationSubtree: PropTypes.arrayOf(PropTypes.object),
    navigationState: PropTypes.object,
    createElement: PropTypes.func.isRequired,
    onNavigate: PropTypes.func.isRequired,
  };

  componentWillMount(): void {
    (this: any).renderScene = this.renderScene.bind(this);
  }

  renderScene(props: NavigationSceneRendererProps): ?ReactElement {
    console.log('RouterNative.RouteView.renderScene');
    console.log('RouterNative.RouteView.renderScene.props', props);
    const { scene } = props;

    const { navigationSubtree } = this.props;
    console.log('RouterNative.RouteView.renderScene.this.props', this.props);

    if (!scene.route || !navigationSubtree) {
      return null;
    }

    const pseudoElement = navigationSubtree.find(
      child => child.props.path === scene.route.path
    );
    console.log(navigationSubtree, scene, pseudoElement);

    if (!pseudoElement) {
      warnOutOfSync('Cannot render scene', scene.route.path);
    }

    const key = scene.route.key;

    const { routeViewComponent, props: routeViewComponentProps } = pseudoElement;

    return React.createElement(
      routeViewComponent,
      {
        ...routeViewComponentProps,
        key,
        navigationState: scene.route,
      }
    );
  }

  getComponentProps(props) {
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
    } = props;
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
    console.log('RouterNative.RouteView.render');
    console.log('RouterNative.RouteView.render.props', this.props);

    const {
      routes,
      params,
      routeParams,
      location,
    } = navigationState;

    // Create NavigationTransitioner for handling nested routes
    let transitioner;
    if (navigationSubtree && routes && routes.length > 0) {
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

    console.log('RouterNative.RouteView.render.transitioner', transitioner);
    console.log('RouterNative.RouteView.render.component', component);
    const componentProps = {
      ...this.getComponentProps(this.props),
      params,
      routeParams,
      location,
      children: transitioner,
    };
    console.log('RouterNative.RouteView.render.component.props', componentProps);

    const element = createElement(component, componentProps);
    console.log('RouterNative.RouteView.render.return', element);
    return element;
  }
}

export default withOnNavigate(RouteView);
