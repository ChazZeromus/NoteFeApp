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
  children?: React.Node,
};

export default class Segment extends React.PureComponent<Props> {
  static defaultProps = {
    contentOffset: 0,
  }

  render() : React.Node {
    const {
      x, y, innerRadius, outerRadius, startAngle, endAngle,
      children,
      ...otherProps
    } = this.props;

    const stroke = new utils.Stroke({x, y});
    const insidePosition = stroke.clone();
    const effectiveProps = _.merge({}, svgStyles.segment, otherProps);

    stroke.setCenter()
      .moveDir(startAngle, innerRadius)
      .arc(innerRadius, endAngle)
      .lineDir(endAngle, outerRadius)
      .arc(innerRadius + outerRadius, startAngle);

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