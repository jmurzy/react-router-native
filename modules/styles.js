/* @flow */

import { StyleSheet, Dimensions } from 'react-native';

export const BTN_UNDERLAY_COLOR = '#E1E2E1';
export const ADDDRESS_BAR_HEIGHT = 70;
export const ADDDRESS_BAR_ROW_HEIGHT = 30;

const { width } = Dimensions.get('window');

// Used across all navigational components i.e StackView
const globalStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  navigationCard: {
    position: 'absolute',
    backgroundColor: '#E9E9EF',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
});

const addressBarStyles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: -ADDDRESS_BAR_HEIGHT,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  addressBar: {
    position: 'absolute',
    height: ADDDRESS_BAR_HEIGHT,
    paddingTop: 18,
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BTN_UNDERLAY_COLOR,
  },
  field: {
    flex: 1,
    height: 40,
    fontSize: 18,
    backgroundColor: '#FFFFFF',
    borderColor: '#C1C2C2',
    borderWidth: 1,
    padding: 4,
    alignSelf: 'center',
    borderRadius: 2,
    marginLeft: 6,
  },
  forwardBtn: {
    width: 34,
    alignItems: 'center',
  },
  forwardBtnText: {
    fontSize: 20,
    color: '#585858',
    marginTop: 6,
  },
  forwardBtnTextDisabled: {
    color: '#C1C2C2',
  },
  backBtn: {
    width: 34,
    alignItems: 'center',
    marginLeft: 6,
  },
  backBtnText: {
    fontSize: 20,
    color: '#585858',
    transform: [{ rotate: '180deg' }],
  },
  backBtnTextDisabled: {
    color: '#C1C2C2',
  },
  docsLink: {
    width: 60,
    fontSize: 16,
    textAlign: 'center',
    color: '#585858',
  },
});

const addressBarHistoryStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  listViewWrapper: {
    position: 'absolute',
    marginBottom: 20,
    width: Math.max(width * 0.60, 180),
    marginLeft: 4,
    marginTop: ADDDRESS_BAR_HEIGHT - 2,
    shadowColor: '#929292',
    shadowOpacity: 1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    backgroundColor: '#FFFFFF',
  },
  listView: {
    flex: 1,
  },
  listViewContent: {
  },
  row: {
    paddingLeft: 10,
    lineHeight: 24,
    height: ADDDRESS_BAR_ROW_HEIGHT,
  },
});

export { globalStyles, addressBarStyles, addressBarHistoryStyles };
