/* @flow */

import React, { PropTypes, Component, Element as ReactElement } from 'react';
import { View, BackAndroid } from 'react-native';
import AddressBar from './AddressBar';
import type {
  EnhancedNavigationRoute,
  Location,
  PseudoElement,
} from './TypeDefinition';

import { ADDDRESS_BAR_HEIGHT, globalStyles as styles } from './styles';

type Props = {
  navigationTree: PseudoElement,
  navigationState: EnhancedNavigationRoute,
  location: Location,
  addressBar: boolean,
};

type Context = {
  router: Object,
};

class RootContainer extends Component<any, Props, any> {

  static propTypes = {
    navigationTree: PropTypes.object.isRequired,
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

  componentWillMount(): void {
    (this: any).handleHardwareBackPress = this.handleHardwareBackPress.bind(this);
  }

  componentDidMount(): void {
    BackAndroid.addEventListener('hardwareBackPress', this.handleHardwareBackPress);
  }

  componentWillUnmount(): void {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleHardwareBackPress);
  }

  handleHardwareBackPress(): boolean {
    const {
      router,
    } = this.context;

    return router.pop();
  }

  context: Context;
  props: Props;

  renderNavigation(navigationState: EnhancedNavigationRoute): ?ReactElement {
    const { navigationTree } = this.props;

    if (!navigationState) {
      return null;
    }

    const { routeViewComponent, props: routeViewComponentProps } = navigationTree;

    return React.createElement(
      routeViewComponent,
      {
        ...routeViewComponentProps,
        navigationState,
      }
    );
  }

  render(): ReactElement<any> {
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

export default RootContainer;
