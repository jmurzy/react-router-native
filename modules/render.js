/* @flow */

import { Component } from 'react';
import { AppRegistry } from 'react-native';

/* eslint-disable import/prefer-default-export */
export const render = (component: ReactElement<any>, appKey: string = 'App'): void => {
/* eslint-enable */
  AppRegistry.registerComponent(appKey, (): ReactClass<any> =>
    class extends Component {
      render(): ReactElement<any> {
        return component;
      }
    });
};
