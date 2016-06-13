## Documentation

Documentation is still a [work-in-progress](https://github.com/jmurzy/react-router-native/issues), and pull requests are accepted gratefully!

One of the the primary goals of this project is to keep its API as close to [React Router](https://github.com/reactjs/react-router) as makes sense. However, navigation on native platforms is a broader topic and we have introduced new concepts and options to accommodate for richer animations, the lack of hyperlinks, scene transitions, gestures et al. For a quick and dirty introduction to these additions, please refer to the [examples](Examples.md).

Surely a proper documentation is forthcoming. In the meantime, you can refer to the [React Router docs](https://github.com/reactjs/react-router/tree/master/docs) as all React Router functionality, except for a few route configuration props that are [not yet implemented](https://github.com/jmurzy/react-router-native/blob/800622777e0dac89461e378d7e6d4e0d37872215/modules/Route.js#L31-L33), is supported by React Router Native.

### Redux Support

Redux is supported via [react-router-redux](https://github.com/reactjs/react-router-redux). The following example was adopted from the package's [README](https://github.com/reactjs/react-router-redux/blob/master/README.md):

```javascript
import React from 'react'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Router, nativeHistory } from 'react-router-native';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import reducers from '<project-path>/reducers'

// Add the reducer to your store on the `routing` key
const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  })
)

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(nativeHistory, store)

const routes = (
  <Provider store={store}>
    /* Tell the Router to use our enhanced history */
    <Router history={nativeHistory}>
      /* ... */
    </Router>
  </Provider>
);

AppRegistry.registerComponent('YourApp', () => () => routes);
```
