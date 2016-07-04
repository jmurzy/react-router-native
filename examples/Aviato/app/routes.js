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

import { NAVIGATION_HEADER_HEIGHT } from './components/styles';

const SECOND_HEADER = NAVIGATION_HEADER_HEIGHT;
const THIRD_HEADER = NAVIGATION_HEADER_HEIGHT * 2;

const routes = (
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

    </TabsRoute>

    <Route path="swap" component={component('#DABF55')}>
      <Route path="nested" component={component('#41BDE2')} />
    </Route>

  </Router>
);

export default routes;
