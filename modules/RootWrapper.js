/* @flow */

import React, { PropTypes, Component, Element as ReactElement } from 'react';
import { View } from 'react-native';
import invariant from 'invariant';
import warnOnce from './warningUtil';
import AddressBar from './AddressBar';
import { PAN_RESPONDER_BACK_ACTION } from './transitionRegistry';
import type { EnhancedNavigationRoute, Location } from './TypeDefinition';

import { ADDDRESS_BAR_HEIGHT, globalStyles as styles } from './styles';

const NAVIGATION_HEADER_BACK_BUTTON_BACK_ACTION = 'BackAction';

type Props = {
  navigationTree: ReactElement,
  navigationState: EnhancedNavigationRoute,
  location: Location,
  addressBar: boolean,
};

type Context = {
  router: Object,
};

class RootWrapper extends Component<any, Props, any> {

  static propTypes = {
    navigationTree: PropTypes.element.isRequired,
    navigationState: PropTypes.object.isRequired,
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

    if (type === NAVIGATION_HEADER_BACK_BUTTON_BACK_ACTION ||
        type === PAN_RESPONDER_BACK_ACTION) {
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

  renderNavigation(navigationState: EnhancedNavigationRoute): ?ReactElement {
    const { navigationTree } = this.props;

    if (!navigationState) {
      return null;
    }
    return React.cloneElement(navigationTree, { navigationState });
  }

  render(): ReactElement {
    const { navigationState, addressBar: isShown, location } = this.props;

    // TODO react-native does not accept `-reverse` values for `flex-direction`. We need to render
    // <AddressBar /> after navigational components to keep it on top. See
    // react-native/pull/6473|7825
    let rootStyles;

    if (isShown) {
      rootStyles = [styles.wrapper, { marginTop: ADDDRESS_BAR_HEIGHT }];
    } else {
      rootStyles = styles.wrapper;
    }

    return (
      <View style={rootStyles}>
        {this.renderNavigation(navigationState)}
        <AddressBar show={isShown} location={location} />
      </View>
    );
  }
}

export default RootWrapper;
