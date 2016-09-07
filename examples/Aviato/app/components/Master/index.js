/* @noflow */

import React, {
  Component,
  PropTypes,
} from 'react';
import {
  View,
  Text,
} from 'react-native';
import {
  Link,
  Pop,
} from 'react-router-native';
import SideMenu from 'react-native-side-menu';

import styles from '../styles';

const Tabs = () => (
  <View style={styles.tabs}>
    <Link
      to="/home"
      activeStyle={styles.tabsActiveStyle}
      style={styles.tabLink}
      underlayColor="transparent"
    >
      <Text style={styles.tabLinkText}>Home</Text>
    </Link>
    <Link
      to="/discover/jmurzy"
      activeStyle={styles.tabsActiveStyle}
      style={styles.tabLink}
      underlayColor="transparent"
    >
      <Text style={styles.tabLinkText}>Discover</Text>
    </Link>
    <Link
      to="/notifications"
      activeStyle={styles.tabsActiveStyle}
      style={styles.tabLink}
      underlayColor="transparent"
    >
      <Text style={styles.tabLinkText}>Notifications</Text>
    </Link>
    <Link
      to="/profile/@jmurzy"
      activeStyle={styles.tabsActiveStyle}
      style={styles.tabLink}
      underlayColor="transparent"
    >
      <Text style={styles.tabLinkText}>Profile</Text>
    </Link>
  </View>
);

const menu = (
  <View style={styles.hamburgerMenuWrapper}>
    <View style={styles.hamburgerMenu}>
      <Link
        to="/"
        style={styles.tabLink}
        activeStyle={styles.tabsActiveStyle}
        underlayColor="transparent"
      >
        <Text style={styles.tabLinkText}>/</Text>
      </Link>
      <Link
        to="/profile/@jmurzy/settings"
        style={styles.tabLink}
        activeStyle={styles.tabsActiveStyle}
        underlayColor="transparent"
      >
        <Text style={styles.tabLinkText}>Settings</Text>
      </Link>
      <Link
        to="/profile/@jmurzy/settings/info"
        style={styles.tabLink}
        activeStyle={styles.tabsActiveStyle}
        underlayColor="transparent"
      >
        <Text style={styles.tabLinkText}>Info</Text>
      </Link>
      <Link
        to="/home/user/private/settings"
        style={styles.tabLink}
        activeStyle={styles.tabsActiveStyle}
        underlayColor="transparent"
      >
        <Text style={styles.tabLinkText}>Private Settings</Text>
      </Link>
      <Link
        to="/home/user/private/settings/info"
        style={styles.tabLink}
        activeStyle={styles.tabsActiveStyle}
        underlayColor="transparent"
      >
        <Text style={styles.tabLinkText}>Private Info</Text>
      </Link>
      <Link
        to="/notifications?hamburger"
        style={styles.tabLink}
        activeStyle={styles.tabsActiveStyle}
        underlayColor="transparent"
      >
        <Text style={styles.tabLinkText}>Notifications (keep menu)</Text>
      </Link>
      <Pop
        style={styles.tabLink}
        underlayColor="transparent"
      >
        <Text style={styles.tabLinkText}>Pop Stack</Text>
      </Pop>
    </View>
  </View>);

export class Master extends Component {
  static childContextTypes = {
    hideMenu: PropTypes.func,
    showMenu: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      isMenuOpen: false,
    };
  }

  getChildContext(): Object {
    return {
      hideMenu: this.hideMenu,
      showMenu: this.showMenu,
    };
  }

  componentWillMount() {
    this.hideMenu = this.hideMenu.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.handleMenuChange = this.handleMenuChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { location } = nextProps;
    if (location.query && location.query.hamburger !== undefined) {
      this.showMenu();
    } else {
      this.hideMenu();
    }
  }

  hideMenu() {
    requestAnimationFrame(() => {
      this.setState({
        isMenuOpen: false,
      });
    });
  }

  showMenu() {
    requestAnimationFrame(() => {
      this.setState({
        isMenuOpen: true,
      });
    });
  }

  handleMenuChange(isMenuOpen) {
    this.setState({ isMenuOpen });
  }

  render() {
    const props = this.props;
    return (
      <View style={styles.master}>
        <SideMenu
          isOpen={this.state.isMenuOpen}
          onChange={this.handleMenuChange}
          menu={menu}
        >
          <View style={styles.body}>
            {props.children}
            <Tabs />
          </View>
        </SideMenu>
      </View>
    );
  }
}
