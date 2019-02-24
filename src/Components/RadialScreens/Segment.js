// @flow
import * as React from 'react';
import { Path, G, Circle } from 'react-native-svg';
import * as utils from './utils';
import _ from 'lodash';

import { svgStyles } from './styles';

type Props = {
  x: number,
  y: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
  contentOffset: number,
  sideShrink: number,
  children?: React.Node,
};

export default class Segment extends React.PureComponent<Props> {
  static defaultProps = {
    contentOffset: 0,
    sideShrink: 0,
  }

  render() : React.Node {
    const {
      x, y,
      innerRadius, outerRadius,
      startAngle, endAngle,
      sideShrink,
      children,
      ...otherProps
    } = this.props;
    const fullRadius = innerRadius + outerRadius;
    
    const innerAngleBias = utils.getAngleOffsetFromShrink(innerRadius, sideShrink);
    const outerAngleBias = utils.getAngleOffsetFromShrink(fullRadius, sideShrink);

    console.log({ innerAngleBias, outerAngleBias });

    const stroke = new utils.Stroke({x, y});
    const insidePosition = stroke.clone();
    const effectiveProps = _.merge({}, svgStyles.segment, otherProps);

    stroke.setCenter()
      .moveDir(innerRadius, startAngle + innerAngleBias)
      .arc(innerRadius, endAngle - innerAngleBias)
      .lineDirFromCenter(fullRadius, endAngle - outerAngleBias)
      .arc(fullRadius, startAngle + outerAngleBias);

    const { x: tx, y: ty } = insidePosition.moveDir(
      startAngle + (endAngle - startAngle) / 2,
      this.props.contentOffset + innerRadius + outerRadius / 2
    ).current;

    return (
      <>
        <Path
          d={stroke.result}
          {...effectiveProps}
        />
        <G transform={`translate(${tx}, ${ty})`}>
          {children}
        </G>
      </>
    );
  }
}