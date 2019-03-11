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
  knobRadius: 30,
  knobColor: 'black',
  knobOpacity: 0.7,
};

type Props = {
  dialStyles?: types.DialStyle,
  segmentList: types.SegmentDescList,
  children: (PanResponder.PanHandlers, renderOverlay: () => React.Node) => React.Node,
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

  circlePos: types.Coord = { x: 0, y: 0 };

  dialRef = React.createRef<typeof Dial>();

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
    this.circlePos = { x: 0, y: 0 };
  }

  handlePanResponderMove(evt: any, gestureState: any) {
    this.circlePos.x += gestureState.vx * 10;
    this.circlePos.y += gestureState.vy * 10;

    const distanceFromCenter = utils.lengthFromCoords(
      {x: 0, y: 0},
      this.circlePos,
    );
    let activeIndex: ?number = null;
    const { innerRadius, knobRadius } = this._currentDialStyles;
    const maxKnobDistance = innerRadius - knobRadius;
    const isInRadius = distanceFromCenter >= maxKnobDistance;
    const showMenu = this.state.showMenu ? true : isInRadius;
    const angle = utils.angleFromCoords(
      {x: 0, y: 0},
      this.circlePos,
    );

    if (isInRadius) {
      const { segmentList } = this.props;

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

    const { current: dialRef } = this.dialRef;

    if (dialRef) {
      // Constrain distance if too far
      if (distanceFromCenter > maxKnobDistance) {
        this.circlePos = utils.xyToDir(0, 0, maxKnobDistance, angle);
      }
      dialRef.setCirclePosition(this.circlePos);
    }
  }

  handlePanResponderRelease(evt: any, gestureState: any) {
    this.setState({ showMenu: false });
  }

  // shouldComponentUpdate(nextProps: Props, nextState: State) : boolean {
  //   return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  // }

  renderOverlay() : React.Node {
    const extraStyle = this.state.showMenu
      ? { zIndex: 10, opacity: 1 } : { zIndex: -1, opacity: 0 };

    return (
      <View style={[styles.dialOverlayView, extraStyle]}>
        <Dial
          ref={this.dialRef}
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
        {this.props.children(this.responder.panHandlers, this.renderOverlay.bind(this))}
      </>
    );
  }
}