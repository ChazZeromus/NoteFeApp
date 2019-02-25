// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import { View, Button, Animated, PanResponder } from 'react-native';
import style from './style';

type Props = {
  children: (panHandlers: Object, animX: Animated.Value, animY: Animated.Value) => React.Node,
};

type State = {
  responder:? PanResponder,
}

export default class Panner extends React.Component<Props, State> {
  state: State = {
    responder: null
  };

  animX: Animated.Value = new Animated.Value(0);
  animY: Animated.Value = new Animated.Value(0);

  onPanResponderMove = Animated.event([
    null, { dx: this.animX, dy: this.animY, }
  ]);

  responder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderGrant: () => {},
    onPanResponderMove: this.onPanResponderMove,
    onPanResponderRelease: () => {},
  });

  render() : React.Node {
    const { onPanResponderMove } = this;
    return this.props.children(this.responder.panHandlers, this.animX, this.animY);
  }
}