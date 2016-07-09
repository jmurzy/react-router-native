/* @flow */

import React, {
  PropTypes,
  Component,
  Element as ReactElement,
} from 'react';
import {
  TouchableHighlight,
} from 'react-native';
import warning from 'warning';

type Props = {
  state: ?Object,
  onPress: ?Function,
  type: string,
};

class Go extends Component<any, Props, any> {

  static propTypes = {
    state: PropTypes.object,
    onPress: PropTypes.func,
    type: PropTypes.string.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount(): void {
    (this: any).handlePress = this.handlePress.bind(this);
  }

  handlePress(event: any): void {
    const { onPress } = this.props;
    if (onPress) {
      onPress(event);
    }

    if (event.defaultPrevented !== true) {
      const { type } = this.props;

      if (type === 'pop') {
        this.context.router.pop();
      } else if (type === 'back') {
        this.context.router.goBack();
      } else if (type === 'forward') {
        this.context.router.goForward();
      } else {
        warning(
          false,
          'You should use `<Pop>` or `<Back>` instead.'
        );
      }
    }
  }

  props: Props;

  render(): ReactElement<any> {
    return (
      <TouchableHighlight {...this.props} onPress={this.handlePress} />
    );
  }
}

export default Go;
