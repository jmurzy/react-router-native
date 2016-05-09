/* @flow */

import React, { PropTypes, Component } from 'react';
import warning from 'warning';
import { View, TextInput, Text, TouchableHighlight, Linking } from 'react-native';
import Back from './Back';
import Forward from './Forward';
import AddressBarHistory from './AddressBarHistory';
import { BTN_UNDERLAY_COLOR, addressBarStyles as styles } from './styles';
import type { Snapshot } from './TypeDefinition';

type Props = {
  location: Object,
  show: boolean,
};

type DefaultProps = {
  show: boolean,
};

type Context = {
  router: Object,
  backwardHistory: Array<Snapshot>,
  forwardHistory: Array<Snapshot>,
};

type State = {
  href: string,
  historyType: boolean | string,
};

class AddressBar extends Component<DefaultProps, Props, State> {

  static contextTypes = {
    router: PropTypes.object.isRequired,
    backwardHistory: PropTypes.array.isRequired,
    forwardHistory: PropTypes.array.isRequired,
  };

  static propTypes = {
    show: PropTypes.bool,
  };

  static defaultProps = {
    show: false,
  };

  constructor(props: Props, context: Context) {
    super(props, context);

    const { location } = props;
    const { router } = context;

    const href = router.createHref(location);
    this.state = { href, historyType: false };
  }

  state: State;

  componentWillMount(): void {
    (this: any).toggleDropdown = this.toggleDropdown.bind(this);
    (this: any).onPressSnapshot = this.onPressSnapshot.bind(this);
    (this: any).onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps: Props): void {
    const { location } = nextProps;
    const { router } = this.context;
    const href = router.createHref(location);
    this.setState({
      href,
    });
  }

  onSubmit(to: string): void {
    const { router } = this.context;
    router.push(to);
  }

  onPressSnapshot(offset: number): void {
    const { router } = this.context;
    this.setState({
      historyType: false,
    });
    router.go(offset);
  }

  props: Props;
  context: Context;

  openDocs(): void {
    Linking.openURL('http://github.com/jmurzy/react-router-native')
           .catch(err => {
             warning(
               false,
               'Failed to open URL %s',
               err
             );
           });
  }

  toggleDropdown(type: boolean | string): void {
    this.setState({
      historyType: type,
    });
  }

  render(): ?ReactElement {
    const { show } = this.props;

    if (!show) {
      return null;
    }

    const { historyType } = this.state;

    const { backwardHistory, forwardHistory } = this.context;
    const noBackwardHistory = backwardHistory.length <= 1;
    const noForwardHistory = forwardHistory.length <= 0;

    let backButtonTextStyle;
    if (noBackwardHistory) {
      backButtonTextStyle = [styles.backBtnText, styles.backBtnTextDisabled];
    } else {
      backButtonTextStyle = styles.backBtnText;
    }

    let forwardButtonTextStyle;
    if (noForwardHistory) {
      forwardButtonTextStyle = [styles.forwardBtnText, styles.forwardBtnTextDisabled];
    } else {
      forwardButtonTextStyle = styles.forwardBtnText;
    }

    let history = [];

    if (historyType === 'backward') {
      history = [...backwardHistory];
      // Omit current snapshot
      history.pop();
      history = history.reverse();
    }

    if (historyType === 'forward') {
      history = forwardHistory;
    }

    return (
      <View style={styles.wrapper} pointerEvents="box-none">
        <View style={styles.addressBar}>
          <Back
            disabled={noBackwardHistory}
            onLongPress={() => this.toggleDropdown('backward')}
            style={styles.backBtn}
            underlayColor={BTN_UNDERLAY_COLOR}
          >
            <Text style={backButtonTextStyle}>{'\u2794'}</Text>
          </Back>
          <Forward
            disabled={noForwardHistory}
            onLongPress={() => this.toggleDropdown('forward')}
            style={styles.forwardBtn}
            underlayColor={BTN_UNDERLAY_COLOR}
          >
            <Text style={forwardButtonTextStyle}>{'\u2794'}</Text>
          </Forward>
          <TextInput
            autoCorrect={false}
            autoCapitalize="none"
            onSubmitEditing={() => this.onSubmit(this.state.href)}
            style={styles.field}
            onChangeText={(href) => this.setState({ href })}
            value={this.state.href}
          />
          <TouchableHighlight
            underlayColor={BTN_UNDERLAY_COLOR}
            onPress={() => this.openDocs()}
          >
            <Text style={styles.docsLink}>Docs</Text>
          </TouchableHighlight>
        </View>
        <AddressBarHistory
          historyType={historyType}
          history={history}
          onPressSnapshot={this.onPressSnapshot}
          onPressBackdrop={() => this.toggleDropdown(false)}
        />
      </View>);
  }
}

export default AddressBar;
