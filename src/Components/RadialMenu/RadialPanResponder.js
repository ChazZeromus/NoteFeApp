// @flow
import * as React from 'react';
import { PanResponder } from 'react-native';

import * as types from './types';

type Props = {
  children: PanResponder.PanHandlers => React.Node,
  segments: types.SegmentDescList,
};

type State = {
  showMenu: boolean,
};

export class RadialPanResponder extends React.Component<Props, State> {
  state: State = {
    showMenu: false,
  }

  responder: PanResponder;

  constructor(props: Props) {
    super(props);

    this.responder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderGrant: this.handlePanResponderGrant.bind(this),
      onPanResponderMove: this.handlePanResponderMove.bind(this),
      onPanResponderRelease: this.handlePanResponderRelease.bind(this),
    });
  }

  handlePanResponderGrant(evt: any, gestureState: any) {
    this.setState({ showMenu: true });
  }

  handlePanResponderMove(evt: any, gestureState: any) {

  }

  handlePanResponderRelease(evt: any, gestureState: any) {
    this.setState({ showMenu: false });
  }

  render() : React.Node {
    return this.props.children(this.responder.panHandlers);
  }
}