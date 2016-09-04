/* @noflow */

import React, { Component } from 'react';
import {
  NavigationExperimental,
} from 'react-native';

import styles from '../styles';

const {
  Header: NavigationHeader,
} = NavigationExperimental;

const {
  Title: NavigationHeaderTitle,
} = NavigationHeader;

export default class Header extends Component {

  componentWillMount() {
    this.renderTitleComponent = this.renderTitleComponent.bind(this);
  }

  renderTitleComponent(props) {
    const { scene } = props;
    const title = String(scene.route.key || '');
    return (
      <NavigationHeaderTitle>
        {title}
      </NavigationHeaderTitle>
    );
  }

  renderRightComponent() {
    return;
  }

  renderLeftComponent() {
    return;
  }

  render() {
    return (
      <NavigationHeader
        style={styles.discoverHeader}
        {...this.props}
        renderLeftComponent={this.renderLeftComponent}
        renderRightComponent={this.renderRightComponent}
        renderTitleComponent={this.renderTitleComponent}
      />
    );
  }
}
