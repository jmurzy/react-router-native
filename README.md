# React Router Native [![npm version](https://img.shields.io/npm/v/react-router-native.svg?style=flat-square)](https://www.npmjs.com/package/react-router-native) [![npm](https://img.shields.io/npm/l/react-router-native.svg)](https://github.com/jmurzy/react-router-native/blob/master/LICENSE.md)

A routing library for [React Native](https://github.com/facebook/react-native) that strives for sensible API parity with [react-router](https://github.com/reactjs/react-router/).

<img align="right" width="360px" src="https://raw.githubusercontent.com/jmurzy/react-router-native/master/docs/screenshot.gif">

### Questions?
Feedback is appreciated, but please keep in mind that the project contains components that are currently under active development and considered experimental. Documentation is still a work-in-progress, and pull requests are accepted gratefully!

Feel free to reach out to me on Twitter [@jmurzy](https://twitter.com/jmurzy). If you have any questions, please submit an Issue with the "question" tag or come hang out in the React Router [Reactiflux Channel](https://discord.gg/0ZcbPKXt5bYaNQ46) and post your request there.

### Platform Support

React Router Native is cross-platform. It supports all platforms that [NavigationExperimental](https://github.com/ericvicenti/navigation-rfc) supports.

### Installation

Using [npm](https://www.npmjs.com/):

```sh
$ npm install --save react-router react-router-native
```
### Usage

```javascript
import { Router, Route, render } from 'react-router-native';

const APP_KEY = 'app'

const App = (props) => (/*...*/);
const About = (props) => (/*...*/);
const Users = (props) => (/*...*/);
const User = (props) => (/*...*/);
const NoMatch = (props) => (/*...*/);

render((
  /* Address Bar can be toggled on or off by setting the addressBar prop */
  <Router addressBar>
    <Route path="/" component={App}>
      <Route path="about" component={About}/>
      <Route path="users" component={Users}>
        <Route path="/user/:userId" component={User}/>
      </Route>
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
), APP_KEY);
```

### Thanks

React Router Native is based on [React Router](https://github.com/reactjs/react-router). Thanks to Ryan Florence [@ryanflorence](https://twitter.com/ryanflorence), Michael Jackson [@mjackson](https://twitter.com/mjackson) and all the contributors for their work on [react-router](https://github.com/reactjs/react-router) and [history](https://github.com/mjackson/history).

Special thanks to Eric Vicenti [@ericvicenti](https://twitter.com/ericvicenti) for his work on [NavigationExperimental](https://github.com/ericvicenti/navigation-rfc).
