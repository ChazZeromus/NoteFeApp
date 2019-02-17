// @flow
import * as React from 'react';
import { Path, G, Circle } from 'react-native-svg';
import * as utils from './utils';

import { svgStyles } from './styles';

type SegmentProps = {
  x: number,
  y: number,
  innerRadius: number,
  thickness: number,
  startAngle: number,
  endAngle: number,
  contentOffset: number,
  children?: React.Node,
};

export default class RadialSegment extends React.PureComponent<SegmentProps> {
  static defaultProps = {
    contentOffset: 0,
  }

  render() : React.Node {
    const {
      x, y, innerRadius, thickness, startAngle, endAngle,
      children,
      ...otherProps
    } = this.props;

    const stroke = new utils.Stroke({x, y});
    const insidePosition = stroke.clone();

    stroke.setCenter()
      .moveDir(startAngle, innerRadius)
      .arc(innerRadius, endAngle)
      .lineDir(endAngle, thickness)
      .arc(innerRadius + thickness, startAngle);

    const { x: tx, y: ty } = insidePosition.moveDir(
      startAngle + (endAngle - startAngle) / 2,
      this.props.contentOffset + innerRadius + thickness / 2
    ).current;

    return (
      <>
        <Path
          d={stroke.result}
          {...svgStyles.segment}
          {...otherProps}
        />
        <G transform={`translate(${tx}, ${ty})`}>
          {children}
        </G>
      </>
    );
  }
}