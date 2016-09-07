/* @noflow */

import React from 'react';
import {
  View,
} from 'react-native';

import {
  Header,
} from 'react-router-native';

import styles from './styles';

export const component = (backgroundColor) => (props) => (
  <View style={[styles.component, { backgroundColor }]}>
    {props.children}
  </View>
);

export const stackHeaderComponent = (backgroundColor) => (props) => {
  const { scene } = props;
  const title = String(scene.route.key || '');

  return (
    <Header
      {...props}
      title={title}
      leftButtonText="Back"
      style={{ backgroundColor }}
    />
  );
};

export const tabHeaderComponent = (backgroundColor) => (props) => {
  const { scene } = props;
  const title = String(scene.route.key || '');

  return (
    <Header
      {...props}
      title={title}
      style={{ backgroundColor }}
    />
  );
};
