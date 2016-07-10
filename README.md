# React Router Native [![CircleCI](https://img.shields.io/circleci/project/jmurzy/react-router-native/master.svg?style=flat-square)](https://circleci.com/gh/jmurzy/react-router-native) [![npm version](https://img.shields.io/npm/v/react-router-native.svg?style=flat-square)](https://www.npmjs.com/package/react-router-native) [![npm](https://img.shields.io/npm/l/react-router-native.svg?style=flat-square)](https://github.com/jmurzy/react-router-native/blob/master/LICENSE.md) [![Discord Channel](https://img.shields.io/badge/discord-react--router@reactiflux-738bd7.svg?style=flat-square)](https://discord.gg/0ZcbPKXt5bYaNQ46)

A routing library for [React Native](https://github.com/facebook/react-native) that strives for sensible API parity with [react-router](https://github.com/reactjs/react-router/).

<img align="right" width="360px" src="https://raw.githubusercontent.com/jmurzy/react-router-native/master/docs/screenshot.gif">

### Background

React Router community decided that a [reducer-based paradigm](https://github.com/reactjs/react-router/issues/743) similar to that of **NavigationExperimental** is better suited to native navigation. Transition to a reducer-based paradigm is also being [discussed](https://github.com/reactjs/react-router/issues/3190) for the web. On the other hand, NavigationExperimental [has no intention to support ](https://github.com/ericvicenti/navigation-rfc/issues/64#issuecomment-209001717) a React Router-like interface and leaves the navigation state up to the developer to maintain.

A declarative API removes the need to write [boilerplate code](https://github.com/facebook/react-native/commit/1dc33b5f23640a60682ac879b9a3e94a4aa519d9) and speeds up development. React Router Native follows React's __Learn Once, Write Anywhere__ principle by providing a superset of React Router's API that marries _React Router_ to _NavigationExperimental_.

#### Goals

- URL Driven Development
- Learn once, write anywhere: knowledge and proven idioms from react-router can be reused while extending them as necessary to allow navigation semantics unique to native platforms
- First class deep linking support
- [Cross-platform](#platform-support)

**Note**: This project contains components that are currently under [active](https://github.com/facebook/react-native/commits?author=ericvicenti) [development](https://github.com/facebook/react-native/commits?author=hedgerwang) and considered experimental—aka use in production at your own risk.

### Installation

#### Using npm:

```sh
$ npm install --save react-router-native react-router
```

Do not let npm confuse you: there used to be another project with the same name that the previous owner nuked. Unfortunately, removing or re-publishing old versions is no longer supported by npm. So packages that are tagged __< v2.0.0__ on npm *are artifacts of a different project*, and the first stable version of this library *will be released as __v2.0.0__* and strictly follow the [React Versioning Scheme](https://facebook.github.io/react/blog/2016/02/19/new-versioning-scheme.html) afterwards.

### Usage

```javascript
/**
 * index.[ios|android].js
 */

import React from 'react'
import { AppRegistry } from 'react-native';
import { Router, Route, TabsRoute, nativeHistory } from 'react-router-native';

const App = (props) => (/*...*/);
const About = (props) => (/*...*/);
const AboutHeader = (props) => (/*...*/);
const Users = (props) => (/*...*/);
const User = (props) => (/*...*/);
const UserHeader = (props) => (/*...*/);
const NoMatch = (props) => (/*...*/);

const routes = (
  /* Address Bar can be toggled on or off by setting the addressBar prop */
  <Router history={nativeHistory} addressBar>
    <TabsRoute
      path="app"
      component={App}
      transition="horizontal-pager"
    >
      <Route path="/" component={About} overlayComponent={AboutHeader}/>
      <Route path="users" component={Users} overlayComponent={UserHeader}>
        <Route path="/user/:userId" component={User}/>
      </Route>
    </TabsRoute>
    <Route path="*" component={NoMatch}/>
  </Router>
);

AppRegistry.registerComponent('YourApp', () => () => routes);
```

### Advanced Usage

You can customize behavior of the default reducers that are used to create the `navigationState` of `<Route>` or its siblings.

This allows greater customizations on how `<Link>` behaves for a particular route and is especially useful for nested `<StackRoute>`'s where default action doesn't always lead to the intended behavior, or `<TabsRoute>`'s where double-taps should reset the `navigationState` of a nested `<StackRoute>`.

```js
const reducer = (
  state: EnhancedNavigationState,
  action: NavigationAction
): EnhancedNavigationState => ({
  /* ... */
});

<TabsRoute path="/" component={Component} reducer={reducer}/>
```

### Example
The example app from the GIF can be found at `examples/Aviato`. You can run it as follows:

```bash
git clone https://github.com/jmurzy/react-router-native

cd react-router-native/examples/Aviato
npm install
```

To deploy to iOS simulator:

```bash
npm run ios
```

—or—

To deploy to Android simulator:

```bash
npm run android
```

Route configuration for the example app can be found in `app/routes.js`. The __address bar__ shown in the demo is used for development only and can be disabled by removing the [`addressBar`](https://github.com/jmurzy/react-router-native/blob/9f68616c22a4d8b525eb19e960c25314f85dd7f8/examples/Aviato/app/routes.js#L139) prop from the ``<Router>`` component.

### Documentation
Documentation can be found [here](/docs).

### Platform Support

React Router Native is cross-platform. It supports all platforms that [NavigationExperimental](https://github.com/ericvicenti/navigation-rfc) supports.

### Contributing
Want to hack on React Router Native? Awesome! We welcome contributions from anyone and everyone. Please see our [guidelines](CONTRIBUTING.md) for more information on workflow and setup.

### Questions?

Feel free to reach out to me on Twitter [@jmurzy](https://twitter.com/jmurzy). If you have any questions, please submit an Issue with the "[question](https://github.com/jmurzy/react-router-native/issues?utf8=%E2%9C%93&q=label%3Aquestion%20)" tag or come hang out in the React Router [Reactiflux Channel](https://discord.gg/0ZcbPKXt5bYaNQ46) and post your request there.

### Thanks

React Router Native is based on [React Router](https://github.com/reactjs/react-router). Thanks to Ryan Florence [@ryanflorence](https://twitter.com/ryanflorence), Michael Jackson [@mjackson](https://twitter.com/mjackson) and all the contributors for their work on [react-router](https://github.com/reactjs/react-router) and [history](https://github.com/mjackson/history).

Special thanks to Eric Vicenti [@ericvicenti](https://twitter.com/ericvicenti) and Hedger Wang [@hedgerwang](https://twitter.com/hedgerwang) for their work on [NavigationExperimental](https://github.com/ericvicenti/navigation-rfc).
