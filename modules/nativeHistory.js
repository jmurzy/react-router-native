/* @flow */

import { createMemoryHistory } from 'react-router';
import { DEFAULT_KEY_LENGTH, createRandomKey } from './LocationUtils';

const stateKey = createRandomKey(DEFAULT_KEY_LENGTH);
const rootEntry = { pathname: '/', state: { stateKey } };
const entries = [rootEntry];
const nativeHistory = createMemoryHistory({ entries, keyLength: DEFAULT_KEY_LENGTH });

export default nativeHistory;
