/* @flow */

import React, { Component, PropTypes } from 'react';
import { NavigationExperimental } from 'react-native';
import { warnOutOfSycn } from './warningUtil';
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
  navigationComponent: ReactClass,
  navigationScenes: ?Array<ReactElement>,
  navigationState: EnhancedNavigationRoute,
  onNavigate: Function,
};

class RouteView extends Component<any, Props, any> {

  static propTypes = {
    path: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    navigationComponent: PropTypes.any.isRequired,
    navigationScenes: PropTypes.arrayOf(PropTypes.element),
    navigationState: PropTypes.object,
    onNavigate: PropTypes.func.isRequired,
  };

  componentWillMount(): void {
    (this: any).renderScene = this.renderScene.bind(this);
  }

  renderScene(props: NavigationSceneRendererProps): ?ReactElement {
    const { scene } = props;

    const { navigationScenes } = this.props;

    if (!scene.route || !navigationScenes) {
      return null;
    }

    const navigationScene = navigationScenes.find(
      navScene => navScene.props.path === scene.route.path
    );

    if (!navigationScene) {
      warnOutOfSycn('Cannot render scene', scene.route.path);
    }

    const key = scene.route.key;

    return React.cloneElement(navigationScene, { key, navigationState: scene.route });
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
    } = navigationState;

    let wrappedChildren;
    if (navigationScenes && routes && routes.length > 0) {
      // react-native/c3714d7ed7c8ee57e005d51147820456ef8cda3e
      // FIXME Replace `Transitioner` with `View` to reclaim performance
      wrappedChildren = (
        <NavigationTransitioner
          style={styles.wrapper}
          navigationState={navigationState}
          renderScene={this.renderScene}
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

export default withOnNavigate(RouteView);
