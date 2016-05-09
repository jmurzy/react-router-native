/* @flow */

import React, { PropTypes, Component, Element as ReactElement } from 'react';
import { View, NavigationExperimental } from 'react-native';
import invariant from 'invariant';
import warnOnce from './warningUtil';
import AddressBar from './AddressBar';
import type { EnhancedNavigationState, Location } from './TypeDefinition';

import { ADDDRESS_BAR_HEIGHT, globalStyles as styles } from './styles';

type Props = {
  navigationTree: ReactElement,
  navState: EnhancedNavigationState,
  location: Location,
  addressBar: boolean,
};

type Context = {
  router: Object,
};

const {
  RootContainer: NavigationRootContainer,
} = NavigationExperimental;

// NavigationExperimental/NavigationCardStackPanResponder.js#L68
const NavigationCardStackPanResponder = {
  Actions: {
    BACK: { type: 'back' },
  },
};

class RootWrapper extends Component<any, Props, any> {

  static propTypes = {
    navigationTree: PropTypes.element.isRequired,
    navState: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    addressBar: PropTypes.bool,
  };

  static defaultProps = {
    addressBar: false,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  static childContextTypes = {
    onNavigate: PropTypes.func,
  };

  getChildContext(): Object {
    return {
      onNavigate: this.handleNavigation,
    };
  }

  componentWillMount(): void {
    (this: any).handleNavigation = this.handleNavigation.bind(this);
  }

  props: Props;
  context: Context;

  handleNavigation(action: Object): boolean { // eslint-disable-line consistent-return
    const { type } = action;

    const { type: backType } = NavigationRootContainer.getBackAction();
    const { Actions: { BACK: { type: panBackType } } } = NavigationCardStackPanResponder;

    if (type === backType || type === panBackType) {
      warnOnce(
        false,
        'Using <NavigationHeader /> with the default `renderLeftComponent` prop that uses' +
        '<NavigationHeaderBackButton />. Instead, you should override it with a custom' +
        '`renderLeftComponent` that uses <Pop /> or `context.router.pop()`.'
      );

      const didPop = this.context.router.pop();

      return didPop;
    }

    invariant(
      false,
      'onNavigate is not supported. Use <Link /> or context.router.push() instead.'
    );
  }

  renderNavigation(navigationState: EnhancedNavigationState): ?ReactElement {
    const { navigationTree } = this.props;

    if (!navigationState) {
      return null;
    }
    return React.cloneElement(navigationTree, { _navigationState: navigationState });
  }

  render(): ReactElement {
    const { navState, addressBar: isShown, location } = this.props;

    // TODO react-native does not accept `-reverse` values for `flex-direction`. We need to render
    // <AddressBar /> after navigational components to keep it on top. See react-native/pull/6473
    let rootStyles;

    if (isShown) {
      rootStyles = [styles.wrapper, { marginTop: ADDDRESS_BAR_HEIGHT }];
    } else {
      rootStyles = styles.wrapper;
    }

    return (
      <View style={rootStyles}>
        {this.renderNavigation(navState)}
        <AddressBar show={isShown} location={location} />
      </View>
    );
  }
}

export default RootWrapper;
