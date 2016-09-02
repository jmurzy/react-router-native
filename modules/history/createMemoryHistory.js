import invariant from 'invariant';
import warning from 'warning';
import { createLocation } from 'history/lib/LocationUtils';
import { createPath, parsePath } from 'history/lib/PathUtils';
import { POP } from 'history/lib/Actions';
import createHistory from 'history/lib/createHistory';

const createStateStorage = (entries) =>
  entries
    .filter(entry => entry.state)
    .reduce((memo, entry) => {
      /* eslint-disable no-param-reassign */
      memo[entry.key] = entry.state;
      /* eslint-enable */
      return memo;
    }, {});

const createMemoryHistory = (opts = {}) => {
  let options = opts;

  if (Array.isArray(options)) {
    options = { entries: options };
  } else if (typeof options === 'string') {
    options = { entries: [options] };
  }

  let { entries, current } = options;

  const storage = createStateStorage(entries);

  const saveState = (key, state) => {
    storage[key] = state;
  };

  const readState = (key) => storage[key];

  const getCurrentLocation = () => {
    const entry = entries[current];
    const path = createPath(entry);

    let key;
    let state;

    if (entry.key) {
      key = entry.key;
      state = readState(key);
    }

    const init = parsePath(path);

    return createLocation({ ...init, state }, undefined, key);
  };

  const canGo = (n) => {
    const index = current + n;
    return index >= 0 && index < entries.length;
  };

  const go = (n) => {
    if (!n) {
      return;
    }

    if (!canGo(n)) {
      warning(
        false,
        'Cannot go(%s) there is not enough history',
        n
      );

      return;
    }

    current += n;
    const currentLocation = getCurrentLocation();

    // Change action to POP
    /* eslint-disable no-use-before-define */
    history.transitionTo({ ...currentLocation, action: POP });
    /* eslint-enable */
  };

  const pushLocation = (location) => {
    current += 1;

    if (current < entries.length) {
      entries.splice(current);
    }

    entries.push(location);

    saveState(location.key, location.state);
  };

  const replaceLocation = (location) => {
    entries[current] = location;
    saveState(location.key, location.state);
  };

  const history = createHistory({
    ...options,
    getCurrentLocation,
    pushLocation,
    replaceLocation,
    go,
  });

  if (typeof entries === 'string') {
    entries = [entries];
  } else if (!Array.isArray(entries)) {
    entries = ['/'];
  }

  entries = entries.map(entry => createLocation(entry));

  if (current == null) {
    current = entries.length - 1;
  } else {
    invariant(
      current >= 0 && current < entries.length,
      'Current index must be >= 0 and < %s, was %s',
      entries.length, current
    );
  }

  return history;
};

export default createMemoryHistory;
