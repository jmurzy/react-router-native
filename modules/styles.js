/* @flow */

import { StyleSheet, Dimensions } from 'react-native';

export const BTN_UNDERLAY_COLOR = '#E1E2E1';
export const ADDDRESS_BAR_HEIGHT = 70;
export const ADDDRESS_BAR_ROW_HEIGHT = 30;

const { width } = Dimensions.get('window');

const { absoluteFillObject } = StyleSheet;

// Used across all navigational components i.e StackRouteView
const globalStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  navigationCard: {
    ...absoluteFillObject,
    backgroundColor: '#E9E9EF',
    overflow: 'hidden',
  },
});

const addressBarStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: -ADDDRESS_BAR_HEIGHT,
  },
  addressBar: {
    alignItems: 'center',
    backgroundColor: BTN_UNDERLAY_COLOR,
    flexDirection: 'row',
    height: ADDDRESS_BAR_HEIGHT,
    justifyContent: 'center',
    left: 0,
    paddingTop: 18,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  field: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#C1C2C2',
    borderRadius: 2,
    borderWidth: 1,
    flex: 1,
    fontSize: 18,
    height: 40,
    marginLeft: 6,
    padding: 4,
  },
  forwardBtn: {
    alignItems: 'center',
    width: 34,
  },
  forwardBtnText: {
    color: '#585858',
    fontSize: 20,
    marginTop: 6,
  },
  forwardBtnTextDisabled: {
    color: '#C1C2C2',
  },
  backBtn: {
    alignItems: 'center',
    marginLeft: 6,
    width: 34,
  },
  backBtnText: {
    color: '#585858',
    fontSize: 20,
    transform: [{ rotate: '180deg' }],
  },
  backBtnTextDisabled: {
    color: '#C1C2C2',
  },
  docsLink: {
    color: '#585858',
    fontSize: 16,
    textAlign: 'center',
    width: 60,
  },
});

const addressBarHistoryStyles = StyleSheet.create({
  container: {
    ...absoluteFillObject,
  },
  backdrop: {
    ...absoluteFillObject,
  },
  listViewWrapper: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    marginLeft: 4,
    marginTop: ADDDRESS_BAR_HEIGHT - 2,
    position: 'absolute',
    shadowColor: '#929292',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 2,
    width: Math.max(width * 0.60, 180),
  },
  listView: {
    flex: 1,
  },
  listViewContent: {
  },
  row: {
    height: ADDDRESS_BAR_ROW_HEIGHT,
    lineHeight: 24,
    paddingLeft: 10,
  },
});

export { globalStyles, addressBarStyles, addressBarHistoryStyles };
