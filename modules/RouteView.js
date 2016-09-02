/* @flow */

import React, { Component, PropTypes } from 'react';
import { NavigationExperimental, View } from 'react-native';
import { warnOutOfSync } from './warningUtil';
import { globalStyles as styles } from './styles';

import type {
  EnhancedNavigationRoute,
  PseudoElement,
  NavigationTransitionProps,
} from './TypeDefinition';

const {
  Transitioner: NavigationTransitioner,
} = NavigationExperimental;

type Props = {
  path: string,
  type: string,
  component: ReactClass<any>,
  navigationSubtree: ?Array<PseudoElement>,
  navigationState: EnhancedNavigationRoute,
  createElement: Function,
};

class RouteView extends Component<any, Props, any> {

  static propTypes = {
    path: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    component: PropTypes.any.isRequired,
    navigationSubtree: PropTypes.arrayOf(PropTypes.object),
    navigationState: PropTypes.object,
    createElement: PropTypes.func.isRequired,
  };

  componentWillMount(): void {
    (this: any).renderTransition = this.renderTransition.bind(this);
    (this: any).renderScene = this.renderScene.bind(this);
  }

  // $FlowFixMe NavigationSceneRendererProps
  renderScene(props): ?ReactElement {
    const { scene } = props;

    const { navigationSubtree } = this.props;

    if (!scene.route || !navigationSubtree) {
      return null;
    }

    const pseudoElement = navigationSubtree.find(
      child => child.props.path === scene.route.path
    );

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

  renderTransition(props: NavigationTransitionProps): ReactElement<any> {
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
        {scenes}
      </View>
    );
  }

  render(): ReactElement<any> {
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
    } = navigationState;

    // Create NavigationTransitioner for handling nested routes
    let transitioner;
    if (navigationSubtree && routes && routes.length > 0) {
      // react-native/c3714d7ed7c8ee57e005d51147820456ef8cda3e
      // FIXME Replace `Transitioner` with `View` to reclaim performance
      const transitionerProps = {
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

export default RouteView;
