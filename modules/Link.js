/* @flow */

import React, { PropTypes, Component } from 'react';
import { TouchableHighlight } from 'react-native';

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
      router.push(to);
    }
  }

  render(): ReactElement {
    const { to, activeStyle, onlyActiveOnIndex, ...props } = this.props;

    const { router } = this.context;

    if (router && to) {
      const location = to;
      if (activeStyle != null) {
        if (router.isActive(location, onlyActiveOnIndex)) {
          if (activeStyle) {
            props.style = [props.style, activeStyle];
          }
        }
      }
    }

    return (
      <TouchableHighlight {...props} onPress={this.handlePress} />
    );
  }
}

export default Link;
