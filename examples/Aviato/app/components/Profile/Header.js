/* @noflow */

import React, { Component, PropTypes } from 'react';
import {
  NavigationExperimental,
  Text,
} from 'react-native';
import {
  Link,
} from 'react-router-native';

const {
  Header: NavigationHeader,
} = NavigationExperimental;

const {
  Title: NavigationHeaderTitle,
} = NavigationHeader;

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
      <NavigationHeaderTitle>
        {title}
      </NavigationHeaderTitle>
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
      <NavigationHeader
        style={styles.profileHeader}
        {...this.props}
        renderLeftComponent={this.renderLeftComponent}
        renderRightComponent={this.renderSettingsButtonComponent}
        renderTitleComponent={this.renderTitleComponent}
      />
    );
  }
}
