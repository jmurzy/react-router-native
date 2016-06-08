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

**Note**: This project contains components that are currently under [active](https://github.com/facebook/react-native/commits?author=ericvicenti) [development](https://github.com/facebook/react-native/commits?author=hedgerwang) and considered experimental—aka use in production at your own risk. Documentation is still a [work-in-progress](https://github.com/jmurzy/react-router-native/issues), and pull requests are accepted gratefully!

### Installation

#### Using npm:

```sh
$ npm install --save react-router-native react-router
```

Do not let npm confuse you: there used to be another project with the same name that the previous owner nuked. Unfortunately, removing or re-publishing old versions is no longer supported by npm. So packages that are tagged __< v2.0.0__ on npm *are artifacts of a different project*, and the first stable version of this library *will be released as __v2.0.0__* and strictly follow the [React Versioning Scheme](https://facebook.github.io/react/blog/2016/02/19/new-versioning-scheme.html) afterwards.

### Example
The example app from the GIF can be found at `examples/Aviato`. You can run it as follows:

```bash
git clone https://github.com/jmurzy/react-router-native
cd react-router-native/examples/Aviato
npm install
react-native run-ios
```

Look at `app/routes.js` and play around with the app to get a feel for what's possible. The __address bar__ shown in the demo is used for development only and can be disabled by removing the [`addressBar`](https://github.com/jmurzy/react-router-native/blob/9f68616c22a4d8b525eb19e960c25314f85dd7f8/examples/Aviato/app/routes.js#L139) prop from the ``<Router>`` component.

### Usage

```javascript
import { Router, Route, render } from 'react-router-native';

const APP_KEY = 'app'

const App = (props) => (/*...*/);
const About = (props) => (/*...*/);
const AboutHeader = (props) => (/*...*/);
const Users = (props) => (/*...*/);
const User = (props) => (/*...*/);
const UserHeader = (props) => (/*...*/);
const NoMatch = (props) => (/*...*/);

render((
  /* Address Bar can be toggled on or off by setting the addressBar prop */
  <Router addressBar>
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
), APP_KEY);
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

### Platform Support

React Router Native is cross-platform. It supports all platforms that [NavigationExperimental](https://github.com/ericvicenti/navigation-rfc) supports.

### Contributing
In order to hack on the library code and sync it into `examples/Aviato/node_modules` run `npm run sync` (depends on `npm i -g sane`). The library code is specified as a [local dependency](https://docs.npmjs.com/files/package.json#local-paths) in the example's [`package.json`](https://github.com/jmurzy/react-router-native/blob/master/examples/Aviato/package.json) -- `npm link` does not work with RN packager right now (it's an [open issue](https://productpains.com/post/react-native/symlink-support-for-packager/)).

We look forward to your input! 👊

### Questions?

Feel free to reach out to me on Twitter [@jmurzy](https://twitter.com/jmurzy). If you have any questions, please submit an Issue with the "question" tag or come hang out in the React Router [Reactiflux Channel](https://discord.gg/0ZcbPKXt5bYaNQ46) and post your request there.

### Thanks

React Router Native is based on [React Router](https://github.com/reactjs/react-router). Thanks to Ryan Florence [@ryanflorence](https://twitter.com/ryanflorence), Michael Jackson [@mjackson](https://twitter.com/mjackson) and all the contributors for their work on [react-router](https://github.com/reactjs/react-router) and [history](https://github.com/mjackson/history).

Special thanks to Eric Vicenti [@ericvicenti](https://twitter.com/ericvicenti) and Hedger Wang [@hedgerwang](https://twitter.com/hedgerwang) for their work on [NavigationExperimental](https://github.com/ericvicenti/navigation-rfc).
