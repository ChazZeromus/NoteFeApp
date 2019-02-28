// @flow
import * as React from 'react';
import { PanResponder, View, Text } from 'react-native';
import _ from 'lodash';

import styles from './styles';
import * as types from './types';
import * as utils from './utils';
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
  activeIndex: ?number,
};

export class RadialPanResponder extends React.Component<Props, State> {
  state: State = {
    showMenu: false,
    activeIndex: null,
  }

  get _currentDialStyles() : types.DialStyle {
    return this.props.dialStyles || defaultDialStyles;
  }

  responder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderGrant: this.handlePanResponderGrant.bind(this),
    onPanResponderMove: this.handlePanResponderMove.bind(this),
    onPanResponderRelease: this.handlePanResponderRelease.bind(this),
  });

  handlePanResponderGrant(evt: any, gestureState: any) {
  }

  handlePanResponderMove(evt: any, gestureState: any) {
    const dCoords = { x: gestureState.dx, y: gestureState.dy };
    const distanceFromCenter = utils.lengthFromCoords(
      {x: 0, y: 0},
      dCoords,
    );
    let activeIndex: ?number = null;
    const isInRadius = distanceFromCenter >= this._currentDialStyles.innerRadius * 0.7;
    const showMenu = this.state.showMenu ? true : isInRadius;

    if (isInRadius) {
      const { segmentList } = this.props;
      const angle = utils.angleFromCoords(
        {x: 0, y: 0},
        dCoords,
      );

      for (let i = 0, c = segmentList.length; i < c; ++i) {
        const segment = segmentList[i];

        if (angle < segment.startAngle) {
          break;
        }
        if (angle > segment.endAngle) {
          continue;
        }

        activeIndex = i;
        break;
      }
    }

    if (this.state.showMenu !== showMenu || this.state.activeIndex !== activeIndex) {
      this.setState({ showMenu, activeIndex });
    }
  }

  handlePanResponderRelease(evt: any, gestureState: any) {
    this.setState({ showMenu: false });
  }

  // shouldComponentUpdate(nextProps: Props, nextState: State) : boolean {
  //   return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  // }

  renderDialModal() : React.Node {
    const extraStyle = this.state.showMenu
      ? { zIndex: 10, opacity: 1 } : { zIndex: -1, opacity: 0 };

    return (
      <View style={[styles.dialModalView, extraStyle]}>
        <Dial
          dialStyle={this._currentDialStyles}
          segmentList={this.props.segmentList}
          activeIndex={this.state.activeIndex}
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