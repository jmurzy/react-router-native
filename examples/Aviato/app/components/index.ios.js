/* @noflow */

import React, { Component, PropTypes } from 'react';
import {
  NavigationExperimental,
  View,
  Text,
} from 'react-native';
import {
  Pop,
} from 'react-router-native';
import styles from './styles';

const {
  Header: NavigationHeader,
} = NavigationExperimental;

const {
  Title: NavigationHeaderTitle,
} = NavigationHeader;

export const component = (backgroundColor) => (props) => (
  <View style={[styles.component, { backgroundColor }]}>
    {props.children}
  </View>
);

export const stackHeaderComponent = (backgroundColor, marginTop = 0) => {
  const headerStyle = { backgroundColor, marginTop };

  return class extends Component {

    componentWillMount() {
      this.renderTitleComponent = this.renderTitleComponent.bind(this);
      this.renderBackButtonComponent = this.renderBackButtonComponent.bind(this);
    }

    renderTitleComponent(props) {
      const { scene } = props;
      const title = String(scene.navigationState.key || '');
      return (
        <NavigationHeaderTitle>
          {title}
        </NavigationHeaderTitle>
      );
    }

    renderBackButtonComponent(props) {
      if (props.scene.index === 0) {
        return null;
      }

      return (
        <Pop
          style={styles.leftHeaderLink}
          underlayColor="transparent"
        >
          <Text style={styles.leftHeaderLinkText}>Back</Text>
        </Pop>
      );
    }

    renderRightComponent() {
      return null;
    }

    render() {
      return (
        <NavigationHeader
          style={headerStyle}
          {...this.props}
          renderTitleComponent={this.renderTitleComponent}
          renderLeftComponent={this.renderBackButtonComponent}
          renderRightComponent={this.renderRightComponent}
        />
      );
    }
  };
};

export const tabHeaderComponent = (backgroundColor, marginTop = 0) => {
  const headerStyle = { backgroundColor, marginTop };

  return class extends Component {

    componentWillMount() {
      this.renderTitleComponent = this.renderTitleComponent.bind(this);
    }

    renderTitleComponent(props) {
      const { scene } = props;
      const title = String(scene.navigationState.key || '');
      return (
        <NavigationHeaderTitle>
          {title}
        </NavigationHeaderTitle>
      );
    }

    renderLeftComponent() {
      return null;
    }

    renderRightComponent() {
      return null;
    }

    render() {
      return (
        <NavigationHeader
          style={headerStyle}
          {...this.props}
          renderTitleComponent={this.renderTitleComponent}
          renderLeftComponent={this.renderLeftComponent}
          renderRightComponent={this.renderRightComponent}
        />
      );
    }
  };
};
