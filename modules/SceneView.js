/* @flow */

import React, { Component } from 'react';
import { NavigationExperimental } from 'react-native';
import { warnOutOfSycn } from './warningUtil';
import { globalStyles as styles } from './styles';

import type { EnhancedNavigationState } from './TypeDefinition';

const {
  AnimatedView: NavigationAnimatedView,
  PropTypes: NavigationPropTypes,
} = NavigationExperimental;

const {
  SceneRenderer: NavigationSceneRendererProps,
} = NavigationPropTypes;

type Props = {
  path: string,
  type: string,
  navigationComponent: ReactClass,
  navScenes: ?Array<ReactElement>,
  _navigationState: EnhancedNavigationState,
};

class SceneView extends Component<any, Props, any> {

  static propTypes = {
    path: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    navigationComponent: React.PropTypes.any.isRequired,
    navScenes: React.PropTypes.arrayOf(React.PropTypes.element),
    _navigationState: React.PropTypes.object,
  };

  componentWillMount(): void {
    (this: any).renderScene = this.renderScene.bind(this);
  }

  renderScene(props: NavigationSceneRendererProps): ?ReactElement {
    const { scene } = props;

    const { navScenes } = this.props;

    if (!scene.navigationState || !navScenes) {
      return null;
    }

    const el = navScenes.find(navScene => navScene.props.path === scene.navigationState.path);

    if (!el) {
      warnOutOfSycn('Cannot render scene', props);
    }

    const key = scene.navigationState.key;

    return React.cloneElement(el, { key, _navigationState: scene.navigationState });
  }

  render(): ReactElement {
    const { navScenes,
            _navigationState,
            navigationComponent: NavigationComponent } = this.props;
    const { children, params, routeParams, location } = _navigationState;

    let wrappedChildren;
    if (navScenes && children && children.length > 0) {
      // react-native/c3714d7ed7c8ee57e005d51147820456ef8cda3e?diff=split
      wrappedChildren = (
        <NavigationAnimatedView
          style={styles.wrapper}
          navigationState={_navigationState}
          renderScene={this.renderScene}
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

export default SceneView;
