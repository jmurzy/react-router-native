import React, {
  Component,
  PropTypes,
} from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
} from 'react-native';
import {
  AnimatedHeader,
  AnimatedHeaderTitle,
} from './NavigationExperimental';

import Pop from './Pop';

const styles = StyleSheet.create({
  headerLink: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 14,
    margin: 10,
  },
  titleText: {
    color: '#000000',
  },
});

type Props = {
  title: ?String,
  titleTextStyle: ?Object,
  leftButtonText: ?String,
  leftButtonTextStyle: ?Object,
  rightButtonText: ?String,
  rightButtonTextStyle: ?Object,
  onRightButtonPress: ?Function,
};

type DefaultProps = {
  onRightButtonPress: Function,
};

class Header extends Component<DefaultProps, Props, any> {

  static propTypes = {
    title: PropTypes.string,
    titleTextStyle: PropTypes.object,
    leftButtonText: PropTypes.string,
    leftButtonTextStyle: PropTypes.object,
    rightButtonText: PropTypes.string,
    rightButtonTextStyle: PropTypes.object,
    onRightButtonPress: PropTypes.func,
  };

  static defaultProps = {
    onRightButtonPress: () => {},
  };

  componentWillMount() {
    this.renderTitleComponent = this.renderTitleComponent.bind(this);
    this.renderBackButtonComponent = this.renderBackButtonComponent.bind(this);
    this.renderRightComponent = this.renderRightComponent.bind(this);
  }

  props: Props;

  renderTitleComponent() {
    const { title, titleTextStyle } = this.props;
    return (
      <AnimatedHeaderTitle
        textStyle={[styles.titleText, titleTextStyle]}
      >
        {title}
      </AnimatedHeaderTitle>
    );
  }

  renderBackButtonComponent(props) {
    if (props.scene.index === 0) {
      return null;
    }

    const { leftButtonText, leftButtonTextStyle } = this.props;

    if (!leftButtonText) {
      return null;
    }

    return (
      <Pop
        style={[styles.headerLink, leftButtonTextStyle]}
        underlayColor="transparent"
      >
        <Text
          style={styles.buttonText}
        >
          {leftButtonText}
        </Text>
      </Pop>
    );
  }

  renderRightComponent() {
    const {
      rightButtonText,
      rightButtonTextStyle,
      onRightButtonPress,
    } = this.props;

    if (!rightButtonText) {
      return null;
    }

    return (
      <TouchableHighlight
        style={styles.headerLink}
        underlayColor="transparent"
        onPress={onRightButtonPress}
      >
        <Text
          style={[styles.buttonText, rightButtonTextStyle]}
        >
          {rightButtonText}
        </Text>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <AnimatedHeader
        {...this.props}
        renderTitleComponent={this.renderTitleComponent}
        renderLeftComponent={this.renderBackButtonComponent}
        renderRightComponent={this.renderRightComponent}
      />
    );
  }
}

export default Header;
