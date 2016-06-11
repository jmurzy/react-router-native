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
  Router,
} from 'react-router-native';

// Temporary helper to make space in console for next run
console.info('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n'); // eslint-disable-line

/**
 * Temporary debug functions
 */
// logging shortcut for functional components
const l = (...args) => console.info(...args); // eslint-disable-line
// disabled logging shortcut
const ll = () => undefined;

const {
  Header: NavigationHeader,
} = NavigationExperimental;

// import NavigationExampleRow from './NavigationExampleRow';
import styles from './styles';

// Next step.
// Define your own scene.
const YourScene = (props) => ll('[Your Scene] props', props) || (
  <ScrollView style={styles.scrollView}>
    <Link to="/apple/foo" style={styles.row} underlayColor="#D0D0D0">
      <Text style={styles.buttonText}>
        Push Route
      </Text>
    </Link>
    <Link to="/apple/bar" style={styles.row} underlayColor="#D0D0D0">
      <Text style={styles.buttonText}>
        Push Route
      </Text>
    </Link>
    {/*
      TODO: Pop Route
    */}
  </ScrollView>
);

// Next step.
// Define your own tabs.
const YourTabs = () => (
  <View style={styles.tabs}>
    <YourTab text="Apple" to="/apple" />
    <YourTab text="Banana" to="/banana" />
  </View>
);

// Next step.
// Define your own Tab
const YourTab = ({ to, text }) => (
  <Link
    to={to}
    activeStyle={styles.tabsActiveStyle}
    style={styles.tabLink}
    underlayColor="transparent"
  >
    <Text style={styles.tabLinkText}>{text}</Text>
  </Link>
);
YourTab.propTypes = {
  to: PropTypes.any.isRequired,
  text: PropTypes.string.isRequired,
};

// Yea ... how?
const howToCheckThatICanPop = true;

// Next step:
// Define your header
const YourHeader = (props) => (
  <NavigationHeader
    {...props}
    renderLeftComponent={(/* props_ */) => ((howToCheckThatICanPop) ? null : (
      <Pop style={styles.leftHeaderLink} underlayColor="transparent">
        <Text style={styles.leftHeaderLinkText}>Back</Text>
      </Pop>
    ))}
    renderTitleComponent={({ scene }) => ll('[renderTitleComponent] scene', scene) || (
      <NavigationHeader.Title>{scene.route.location.pathname}</NavigationHeader.Title>
    )}
  />
);

const YourApplication = ({ children }) => (
  <View style={{ flex: 1 }}>
    {children}
    <YourTabs />
  </View>
);
YourApplication.propTypes = {
  children: PropTypes.node,
};

const redirect = (from, to) => (nextState, replace) => {
  if (nextState.location.pathname === from) {
    replace(to);
  }
};

const Foo = () => (
  <View>
    <Text>foo</Text>
  </View>
);

const routes = (
  <Router>
    <TabsRoute path="/" component={YourApplication} onEnter={redirect('/', '/apple')}>
      <StackRoute
        path="/apple"
        component={YourScene}
        overlayComponent={YourHeader}
        transition="horizontal-card-stack"
      >
        <Route path="foo" component={Foo} />
        <Route path="bar" component={Foo} />
      </StackRoute>

      <Route path="/banana" component={YourScene} overlayComponent={YourHeader} />
    </TabsRoute>
  </Router>
);

AppRegistry.registerComponent('NavigationHeaderScenesTabs', () => () => routes);
