/* @noflow */

import React from 'react';
import { Route, StackRoute, TabsRoute, Router, nativeHistory } from 'react-router-native';
import { component, tabHeaderComponent, stackHeaderComponent } from './components';
import { Master } from './components/Master';
import { HomeHeader } from './components/Home';
import { Discover, DiscoverHeader } from './components/Discover';
import { Notifications } from './components/Notifications';
import { UserOverlay } from './components/User';
import { ProfileHeader } from './components/Profile';

const redirectToNotifications = (nextState, replace) => {
  replace('/notifications');
};

const routes = (
  /* Address Bar can be toggled on or off by setting the addressBar prop */
  <Router history={nativeHistory} addressBar>
    <TabsRoute path="master" component={Master}>

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
            overlayComponent={tabHeaderComponent('#89B2FD')}
          />
          <StackRoute
            path="private"
            component={component('#FFFFFF')}
            overlayComponent={tabHeaderComponent('#89B2FD')}
            transition="horizontal-card-stack"
          >
            <Route
              path="settings"
              component={component('#FFF0D1')}
              overlayComponent={stackHeaderComponent('#C8D574')}
            />
            <Route
              path="settings/info"
              component={component('#EF4E5E')}
              overlayComponent={stackHeaderComponent('#F5807B')}
            />
          </StackRoute>
        </TabsRoute>
        <Route path="following(-:foo)" component={component('#DABF55')} />
      </TabsRoute>

      <Route path="/notifications" component={Notifications} />

      <Route
        path="/discover/:topic"
        component={Discover}
        overlayComponent={DiscoverHeader}
      />

      <StackRoute
        path="/profile/:userId"
        component={component('#000000')}
        overlayComponent={ProfileHeader}
      >
        <Route
          path="settings"
          component={component('#FFF0D1')}
          overlayComponent={stackHeaderComponent('beige')}
          transition="horizontal-card-stack"
        />
        <Route
          path="settings/info"
          component={component('#EF4E5E')}
          overlayComponent={stackHeaderComponent('#F5807B')}
          transition="vertical-card-stack"
        />
      </StackRoute>

    </TabsRoute>

    <Route path="swap" component={component('#DABF55')}>
      <Route path="nested" onEnter={redirectToNotifications} component={component('#41BDE2')} />
    </Route>

  </Router>
);

export default routes;
