import warning from 'warning';
import invariant from 'invariant';

const warned = {};

export function warnOutOfSycn(context: string, path: string) {
  invariant(
    false,
    'react-router-native Route configuration is out of sync with router state. %s at `%s`.',
    context,
    path
  );
}

export default function warnOnce(falseToWarn: boolean, message: string, ...args: Array<any>) {
  if (warned[message]) {
    return;
  }

  warned[message] = true;
  warning(falseToWarn, `[react-router-native] ${message}`, ...args);
}
