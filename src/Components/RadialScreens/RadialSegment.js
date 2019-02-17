// @flow
import * as React from 'react';
import { Path } from 'react-native-svg';
import * as utils from './utils';

import { svgStyles } from './styles';

type SegmentProps = {
  x: number,
  y: number,
  innerRadius: number,
  thickness: number,
  startAngle: number,
  endAngle: number,
};

export default class RadialSegment extends React.PureComponent<SegmentProps> {
  render() : React.Node {
    const {x, y, innerRadius, thickness, startAngle, endAngle, ...otherProps} = this.props;

    const stroke = new utils.Stroke({x, y});
    stroke.setCenter()
      .moveDir(startAngle, innerRadius)
      .arc(innerRadius, endAngle)
      .lineDir(endAngle, thickness)
      .arc(innerRadius + thickness, startAngle);

    return (
      <Path
        d={`${stroke.result}`}
        {...svgStyles.segment}
        {...otherProps}
      />
    );
  }
}