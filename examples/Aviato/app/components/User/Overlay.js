/* @noflow */

import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import {
  Link,
} from 'react-router-native';

import styles from '../styles';

const FeedSwitcher = () => (
  <View style={[styles.switcher, styles.feedSwitcher]}>
    <Link
      to="/"
      style={styles.switcherLink}
      activeStyle={styles.switcherLinkActive}
      underlayColor="transparent"
    >
      <View style={[styles.switcherTabLinkTextWrapper]}><Text>Public</Text></View>
    </Link>
    <Link
      to="/home/user/private"
      style={styles.switcherLink}
      activeStyle={styles.switcherLinkActive}
      underlayColor="transparent"
    >
      <View style={[styles.switcherTabLinkTextWrapper]}><Text>Private</Text></View>
    </Link>
  </View>
);

export default () => (
  <View style={styles.userOverlay}>
    <FeedSwitcher />
  </View>
);
