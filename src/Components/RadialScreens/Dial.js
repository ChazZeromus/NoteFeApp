// @flow
import * as React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import styles, { svgStyles } from './styles';
import * as types from './types';

import Segment from './Segment';

type Props = {
  x: number,
  y: number,
  innerRadius: number,
  outerRadius: number,
  segmentList: types.SegmentDescList,
  contentOffset?: number,
};
type State = {};

export default class Dial extends React.Component<Props, State> {
  renderSegment(desc: types.SegmentDesc) : React.Node {
    const { x, y, innerRadius, outerRadius, contentOffset } = this.props;
    const { startAngle, endAngle, segment } = desc;
    const segmentProps = {
      x, y, startAngle, endAngle,
      innerRadius,
      outerRadius,
      contentOffset,
    };

    return (
      <Segment {...segmentProps}>
      </Segment>
    );
  }

  render() : React.Node {
    const { segmentList } = this.props;

    return (
      <View style={[styles.dial]}>
        {segmentList.map(desc => this.renderSegment(desc))}
      </View>
    )
  }
}