/* @noflow */

import React from 'react';
import {
  Header,
} from 'react-router-native';

import styles from '../styles';

export default (props) => {
  const { scene } = props;
  const title = String(scene.route.key || '');

  return (
    <Header
      {...props}
      title={title}
      style={styles.discoverHeader}
    />
  );
};
