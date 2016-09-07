/* @noflow */

import React, { Component } from 'react';
import {
  Text,
} from 'react-native';
import {
  Link,
  AnimatedHeader,
  AnimatedHeaderTitle,
} from 'react-router-native';

import styles from '../styles';

export default class Header extends Component {

  componentWillMount() {
    this.renderTitleComponent = this.renderTitleComponent.bind(this);
    this.renderSettingsButtonComponent = this.renderSettingsButtonComponent.bind(this);
  }

  renderTitleComponent() {
    const { routeParams } = this.props;
    const title = `Profile ${routeParams.userId}`;

    return (
      <AnimatedHeaderTitle>
        {title}
      </AnimatedHeaderTitle>
    );
  }

  renderSettingsButtonComponent() {
    return (
      <Link
        to="/profile/@jmurzy/settings"
        style={styles.leftHeaderLink}
        underlayColor="transparent"
      >
        <Text style={styles.leftHeaderLinkText}>Settings</Text>
      </Link>
    );
  }

  renderLeftComponent() {
    return;
  }

  render() {
    return (
      <AnimatedHeader
        style={styles.profileHeader}
        {...this.props}
        renderLeftComponent={this.renderLeftComponent}
        renderRightComponent={this.renderSettingsButtonComponent}
        renderTitleComponent={this.renderTitleComponent}
      />
    );
  }
}
