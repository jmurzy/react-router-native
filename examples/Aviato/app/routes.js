/* @noflow */

import React from 'react';
import {
  Route,
  StackRoute,
  TabsRoute,
  Router,
  nativeHistory,
} from 'react-router-native';
import {
  component,
  tabHeaderComponent,
  stackHeaderComponent,
} from './components';
import { Master } from './components/Master';
import { HomeHeader } from './components/Home';
import { Discover, DiscoverHeader } from './components/Discover';
import { Notifications } from './components/Notifications';
import { UserOverlay } from './components/User';
import { ProfileHeader } from './components/Profile';

import { NAVIGATION_HEADER_HEIGHT } from './components/styles';

const SECOND_HEADER = NAVIGATION_HEADER_HEIGHT;
const THIRD_HEADER = NAVIGATION_HEADER_HEIGHT * 2;

/**
 * NOTE: The route hierarchy below is deliberately complex to demonstrate all
 * capabilities of this library, don't approach the information architecture
 * of your real word app like this. :)

 * The hierarchy consists of four bottom tabs:
 * /home, /discover, /notifications and /profile
 *
 */

/** ----------------------------
 * /home
 * -----------------------------
 * /home consists of another tab hierarchy, which can be navigated from a top tab bar:
 * - a 'User' tab
 *   - has a 'public' ('/', entry point of the app) and a 'private' section
 *     (/home/user/private) which can be navigated by two buttons in the bottom
 *     of the page
 *     - The 'private' section (/home/user/private) again has some subroutes,
 *       which can be navigated to by opening the side menu and
 *      selecting 'Private settings' or 'Private Info'
 * - a 'Following' (/home/following) tab
 * - a 'Bar' tab (/home/following-bar), a parameterized version of the 'Following' tab
 */
const homeRoute = (
  <TabsRoute path="/home" component={component('#012B45')} overlayComponent={HomeHeader}>
    <TabsRoute
      path="user"
      component={component('#3B2C57')}
      overlayComponent={UserOverlay}
      transition="horizontal-pager"
    >
      <Route
        path="/"
        component={component('#F5807B')}
        overlayComponent={tabHeaderComponent('#89B2FD', SECOND_HEADER)}
      />
      <StackRoute
        path="private"
        component={component('#FFFFFF')}
        overlayComponent={tabHeaderComponent('#89B2FD', SECOND_HEADER)}
        transition="horizontal-card-stack"
      >
        <Route
          path="settings"
          component={component('#FFF0D1')}
          overlayComponent={stackHeaderComponent('#C8D574', THIRD_HEADER)}
        />
        <Route
          path="settings/info"
          component={component('#EF4E5E')}
          overlayComponent={stackHeaderComponent('#F5807B', THIRD_HEADER)}
        />
      </StackRoute>
    </TabsRoute>
    <Route path="following(-:foo)" component={component('#DABF55')} />
  </TabsRoute>
);

/** ----------------------------
 * /discover & /notifications
 * -----------------------------
 * Nothing special about these routes. :)
 */
const discoverRoute = (
  <Route
    path="/discover/:topic"
    component={Discover}
    overlayComponent={DiscoverHeader}
  />
);

const notificationsRoute = (
  <Route path="/notifications" component={Notifications} />
);

/** ----------------------------
 * /profile/:userId
 * -----------------------------
 * Demonstrates `transition`.
 * Has subpage /profile/:userId/settings which can be navigated to by clicking the top right
 * "Settings" link;
 * Subpage /profile/:userId/settings/info can be navigated to from the side menu via `Info` link.
 */
const profileRoute = (
  <StackRoute
    path="/profile/:userId"
    component={component('#000000')}
    overlayComponent={ProfileHeader}
    transition="vertical-card-stack"
  >
    <Route
      path="settings"
      component={component('#FFF0D1')}
      overlayComponent={stackHeaderComponent('beige', SECOND_HEADER)}
      transition="horizontal-card-stack"
    />
    <Route
      path="settings/info"
      component={component('#EF4E5E')}
      overlayComponent={stackHeaderComponent('#F5807B', SECOND_HEADER)}
    />
  </StackRoute>
);

const swapRoute = (
  <Route path="swap" component={component('#DABF55')}>
    <Route path="nested" component={component('#41BDE2')} />
  </Route>
);

const routes = (
  <Router history={nativeHistory} addressBar>
    <TabsRoute path="master" component={Master}>
			{homeRoute}
      {discoverRoute}
      {notificationsRoute}
      {profileRoute}
    </TabsRoute>
    {swapRoute}
  </Router>
);

export default routes;
