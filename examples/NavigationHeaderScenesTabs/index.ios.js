/* eslint-disable no-use-before-define */
import React, { PropTypes } from 'react';
import {
  AppRegistry,
  Text,
  View,
  ScrollView,
  NavigationExperimental,
} from 'react-native';
import {
  Route,
  Pop,
  StackRoute,
  Link,
  TabsRoute,
  IndexRoute,
  Router,
} from 'react-router-native';

const {
  Header: NavigationHeader,
} = NavigationExperimental;

// Temporary helper to make space in console for next run
console.info('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n'); // eslint-disable-line

/**
 * Temporary debug functions
 */
// logging shortcut for functional components
const l = (...args) => console.info(...args); // eslint-disable-line
// disabled logging shortcut
// const ll = () => undefined;

import styles from './styles';

const Header = (props) => (
  <NavigationExperimental.Header
    {...props}
    renderLeftComponent={(props_) => ((!props_.scene.route.index) ? null : (
      <Pop style={styles.leftHeaderLink} underlayColor="transparent">
        <Text style={styles.leftHeaderLinkText}>Back</Text>
      </Pop>
    ))}
    renderTitleComponent={({ scene }) => (
      <NavigationHeader.Title>
        {scene.route.location.pathname}
      </NavigationHeader.Title>
    )}
  />
);

const Tab = ({ to, text }) => (
  <Link
    to={to}
    activeStyle={styles.tabsActiveStyle}
    style={styles.tabLink}
    underlayColor="transparent"
  >
    <Text style={styles.tabLinkText}>{text}</Text>
  </Link>
);
Tab.propTypes = {
  to: PropTypes.any.isRequired,
  text: PropTypes.string.isRequired,
};

const Tabs = (
  <View style={styles.tabs}>
    <Tab text="Apple" to="/apple" />
    <Tab text="Banana" to="/banana" />
    <Tab text="Orange" to="/orange" />
  </View>
);

const App = ({ children }) => (
  <View style={{ flex: 1 }}>
    {children}
    {Tabs}
  </View>
);
App.propTypes = {
  children: PropTypes.node,
};

const Row = ({ to, text, component: Component = Link }) => (
  <Component to={to} style={styles.row} underlayColor="#D0D0D0">
    <Text style={styles.buttonText}>
        {text}
    </Text>
  </Component>
);
Row.propTypes = {
  to: PropTypes.string,
  text: PropTypes.string.isRequired,
  component: PropTypes.func,
};

const createBody = (fruitName) => () => (
  <View style={styles.body}>
    <Row to={`/${fruitName}/${Date.now()}`} text="Push Route" />
    <Row text="Pop Route" component={Pop} />
  </View>
);

const redirect = (from, to) => (nextState, replace) => {
  if (nextState.location.pathname === from) {
    replace(to);
  }
};

const Page = ({ children }) => <View style={{ flex: 1 }}>{children}</View>;
Page.propTypes = {
  children: PropTypes.node.isRequired,
};

const createFruityStackRoute = (fruitName) => {
  const Body = createBody(fruitName);
  return (
    <StackRoute
      path={`/${fruitName}`}
      component={Page}
      overlayComponent={Header}
      transition="horizontal-card-stack"
    >
      <IndexRoute component={Body} />
      <Route path={`/${fruitName}/:id`} component={Body} />
    </StackRoute>
  );
};
const routes = (
  <Router>
    <TabsRoute path="/" component={App} onEnter={redirect('/', '/apple')}>
      {createFruityStackRoute('apple')}
      {createFruityStackRoute('banana')}
      {createFruityStackRoute('orange')}
    </TabsRoute>
  </Router>
);

AppRegistry.registerComponent('NavigationHeaderScenesTabs', () => () => routes);
