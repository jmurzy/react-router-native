/* @flow */

import React, { PropTypes, Component } from 'react';
import { View, ListView, Text, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import {
  BTN_UNDERLAY_COLOR,
  ADDDRESS_BAR_ROW_HEIGHT,
  addressBarHistoryStyles as styles,
} from './styles';
import type { Snapshot } from './TypeDefinition';

const { DataSource } = ListView;

type Props = {
  historyType: boolean | string,
  onPressBackdrop: Function,
  onPressSnapshot: Function,
  history: Array<Snapshot>,
};

type Context = {
  router: Object,
};

type State = {
  dataSource: DataSource
};

class AddressBarHistory extends Component<any, Props, State> {

  static propTypes = {
    historyType: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
    onPressBackdrop: PropTypes.func,
    onPressSnapshot: PropTypes.func,
    history: PropTypes.array,
  };

  static defaultProps = {
    historyType: false,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props: Props, context: Context) {
    super(props, context);

    const ds = new DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    const { router } = context;
    const { history } = props;

    const paths = history.map(snapshot => router.createPath(snapshot.location));

    this.state = {
      dataSource: ds.cloneWithRows(paths),
    };
  }

  state: State;

  componentWillMount(): void {
    (this: any).renderRow = this.renderRow.bind(this);
  }

  componentWillReceiveProps(nextProps: Props): void {
    const { router } = this.context;
    const { history } = nextProps;
    const ds = this.state.dataSource;

    const paths = history.map(snapshot => router.createPath(snapshot.location));

    this.setState({
      dataSource: ds.cloneWithRows(paths),
    });
  }

  props: Props;
  context: Context;

  renderRow(rowData: string, sectionID: string, rowID: string): ReactElement<any> {
    const { onPressSnapshot, historyType } = this.props;

    let offset = 0;

    if (historyType === 'backward') {
      offset = -Number(rowID) - 1;
    } else if (historyType === 'forward') {
      offset = Number(rowID) + 1;
    }

    return (
      <TouchableHighlight
        underlayColor={BTN_UNDERLAY_COLOR}
        onPress={() => onPressSnapshot(offset)}
      >
        <Text style={styles.row}>{rowData}</Text>
      </TouchableHighlight>

    );
  }

  render(): ?ReactElement {
    const { historyType, onPressBackdrop, history } = this.props;

    if (!historyType) {
      return null;
    }

    const rowCount = history.length;
    const height = ADDDRESS_BAR_ROW_HEIGHT * (rowCount > 5 ? 5.6 : rowCount);

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onPressBackdrop} >
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={[styles.listViewWrapper, { height }]}>
          <ListView
            style={styles.listView}
            contentContainerStyle={styles.listViewContent}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            enableEmptySections
          />
        </View>
      </View>
    );
  }
}

export default AddressBarHistory;
