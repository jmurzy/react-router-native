import {
  StyleSheet,
  PixelRatio,
} from 'react-native';
export default StyleSheet.create({
  navigator: {
    flex: 1,
  },
  navigatorCardStack: {
    flex: 20,
  },
  body: {
    marginTop: 64,
  },
  // tabs: {
  //   flex: 1,
  //   flexDirection: 'row',
  // },
  // tab: {
  //   alignItems: 'center',
  //   backgroundColor: '#fff',
  //   flex: 1,
  //   justifyContent: 'center',
  // },
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
  tabText: {
    color: '#222',
    fontWeight: '500',
  },
  tabSelected: {
    color: 'blue',
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
  row: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#CDCDCD',
  },
  rowText: {
    fontSize: 17,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
  },
});
