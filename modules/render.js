/* @flow */

import { Component } from 'react';
import { AppRegistry } from 'react-native';

// eslint/eslint/issues/5211
/* eslint-disable space-infix-ops */
export const render = (component: ReactElement, appKey: string = 'App'): void => {
/* eslint-enable */
  AppRegistry.registerComponent(appKey, (): ReactClass<any> =>
    class extends Component {
      render(): ReactElement {
        return component;
      }
    });
};
