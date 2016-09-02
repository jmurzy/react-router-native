/* @flow */

import React, { PropTypes, Component } from 'react';
import {
  TouchableHighlight,
} from 'react-native';

type Props = {
  to: any,
  state: ?Object,
  activeStyle: ?Object,
  onlyActiveOnIndex: ?boolean,
  onPress: ?Function,
};

type DefaultProps = {
  style: Object,
  onlyActiveOnIndex: ?boolean,
};

class Link extends Component<DefaultProps, Props, any> {

  static propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    state: PropTypes.object,
    activeStyle: PropTypes.any,
    onlyActiveOnIndex: PropTypes.bool,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    onlyActiveOnIndex: false,
    style: {},
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount(): void {
    (this: any).handlePress = this.handlePress.bind(this);
  }

  props: Props;

  handlePress(event: any): void {
    const { onPress } = this.props;
    if (onPress) {
      onPress(event);
    }

    if (event.defaultPrevented !== true) {
      const { to } = this.props;
      const { router } = this.context;

      // TODO Use TimerMixin
      // docs/performance.html#my-touchablex-view-isn-t-very-responsive
      requestAnimationFrame(() => {
        router.push(to);
      });
    }
  }

  render(): ReactElement<any> {
    const { to, activeStyle, onlyActiveOnIndex, ...passProps } = this.props;

    const { router } = this.context;

    if (router && to) {
      const location = to;
      if (activeStyle != null) {
        if (router.isActive(location, onlyActiveOnIndex)) {
          if (activeStyle) {
            passProps.style = [passProps.style, activeStyle];
          }
        }
      }
    }

    return (
      <TouchableHighlight {...passProps} onPress={this.handlePress} />
    );
  }
}

export default Link;
