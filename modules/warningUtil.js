import warning from 'warning';
import invariant from 'invariant';
import { NavigationExperimental } from 'react-native';

const {
  PropTypes: NavigationPropTypes,
} = NavigationExperimental;

const {
  SceneRenderer: NavigationSceneRendererProps,
} = NavigationPropTypes;

const warned = {};

export function warnOutOfSycn(context: string, props: NavigationSceneRendererProps) {
  invariant(
    false,
    `react-router-native Route configuration is out of sync with router state. ${context} %s`,
    props.scene.navigationState.path
  );
}

export default function warnOnce(falseToWarn: boolean, message: string, ...args: Array<any>) {
  if (warned[message]) {
    return;
  }

  warned[message] = true;
  warning(falseToWarn, `[react-router-native] ${message}`, ...args);
}
