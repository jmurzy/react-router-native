/* @noflow */

import React from 'react';
import {
  View,
} from 'react-native';
import styles from '../styles';

import DiscoverHeader from './Header';

export { DiscoverHeader };

export const Discover = (props) => (
  <View style={styles.discover}>
    {props.children}
  </View>
);
