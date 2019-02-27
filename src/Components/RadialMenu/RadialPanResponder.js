// @flow
import * as React from 'react';
import { PanResponder, View, Text } from 'react-native';

import styles from './styles';
import * as types from './types';
import Dial from './Dial';

const defaultDialStyles: types.DialStyle = {
  position: {x: 0, y: 0},
  innerRadius: 40,
  outerRadius: 100,
  contentOffset: 9,
  segmentMargin: 2,
};

type Props = {
  dialStyles?: types.DialStyle,
  segmentList: types.SegmentDescList,
  children: (PanResponder.PanHandlers, renderDialModal: () => React.Node) => React.Node,
};

type State = {
  showMenu: boolean,
  activeEntry: ?number,
};

export class RadialPanResponder extends React.Component<Props, State> {
  state: State = {
    showMenu: false,
    activeEntry: null,
  }

  responder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderGrant: this.handlePanResponderGrant.bind(this),
    onPanResponderMove: this.handlePanResponderMove.bind(this),
    onPanResponderRelease: this.handlePanResponderRelease.bind(this),
  });

  handlePanResponderGrant(evt: any, gestureState: any) {
    this.setState({ showMenu: true });
  }

  handlePanResponderMove(evt: any, gestureState: any) {

  }

  handlePanResponderRelease(evt: any, gestureState: any) {
    this.setState({ showMenu: false });
  }

  renderDialModal() : React.Node {
    const extraStyle = this.state.showMenu
      ? { zIndex: 10, opacity: 1 } : { zIndex: -1, opacity: 0 };

    return (
      <View style={[styles.dialModalView, extraStyle]}>
        <Dial
          dialStyle={this.props.dialStyles || defaultDialStyles}
          segmentList={this.props.segmentList}
          activeEntry={this.state.activeEntry}
        />
      </View>
    )
  }

  render() : React.Node {
    return (
      <>
        {this.props.children(this.responder.panHandlers, this.renderDialModal.bind(this))}
      </>
    );
  }
}