/* @noflow */

import {
  StyleSheet,
  Platform,
} from 'react-native';

const { hairlineWidth } = StyleSheet;

export const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

export default StyleSheet.create({
  master: {
    flex: 1,
    backgroundColor: 'black',
  },
  body: {
    flex: 1,
    overflow: 'hidden',
  },
  component: {
    flex: 1,
  },
  hamburgerMenuWrapper: {
    flex: 1,
    backgroundColor: '#8B4DFC',
  },
  hamburgerMenu: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 100,
    height: 280,
  },
  hamburgerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerButtonText: {
    margin: 10,
    color: '#000000',
    fontSize: 20,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 60
  },
  tabsActiveStyle: {
    backgroundColor: '#B185FD',
  },
  tabLink: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CECAFE',
  },
  tabLinkText: {
    fontSize: 12,
  },
  leftHeaderLink: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftHeaderLinkText: {
    margin: 10,
    color: '#000000',
    fontSize: 14,
  },
  switcher: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: hairlineWidth,
    borderColor: '#CECAFE',
    borderRadius: 10,
    overflow: 'hidden',
  },
  switcherLink: {
    flex: 1,
  },
  switcherLinkActive: {
    backgroundColor: '#CECAFE',
  },
  homeSwitcher: {
    marginTop: 8,
    height: 26,
  },
  feedSwitcher: {
    height: 28,
  },
  switcherTabLinkTextWrapper: {
    flex: 1,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userOverlay: {
    position: 'absolute',
    bottom: 50,
    right: 0,
    left: 0,
    paddingRight: 100,
    paddingLeft: 100,
  },
  notifications: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  profileHeader: {
    backgroundColor: '#B185FD',
  },
  homeHeader: {
    backgroundColor: '#B185FD',
  },
  discover: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  discoverHeader: {
    backgroundColor: '#97CDF0',
  },
});
