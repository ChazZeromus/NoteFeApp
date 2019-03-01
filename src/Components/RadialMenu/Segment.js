// @flow
import * as React from 'react';
import { Animated, View } from 'react-native';
import Svg, { Path, G, Circle } from 'react-native-svg';
import * as utils from './utils';
import _ from 'lodash';

import styles, { svgStyles } from './styles';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

type Props = {
  x: number,
  y: number,
  width: number,
  height: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
  contentOffset: number,
  sideShrink: number,
  icon?: React.ComponentType<{}>,
  segmentIndex?: number,
  opacityAnim?: Animated.Value,
};

export default class Segment extends React.Component<Props> {
  static defaultProps = {
    contentOffset: 0,
    sideShrink: 0,
  }
  
  static getScalarProps(props: Props) : * {
    const {
      x, y, width, height, innerRadius, outerRadius, startAngle,
      endAngle, contentOffset, sideShrink, segmentIndex
    } = props;

    return {
      x, y, width, height, innerRadius, outerRadius, startAngle,
      endAngle, contentOffset, sideShrink, segmentIndex 
    };
  }

  static getNonScalarProps(props: Props) : * {
    const { icon, opacityAnim } = props;
    return { icon, opacityAnim };
  }

  shouldComponentUpdate(nextProps: Props) : boolean {
    const nextScalar = Segment.getScalarProps(nextProps);
    const myScalar = Segment.getScalarProps(this.props);
    if (!_.isEqual(nextScalar, myScalar)) {
      return true;
    }

    const nextNon = Segment.getNonScalarProps(nextProps);
    const myNon = Segment.getNonScalarProps(this.props);

    return nextNon.opacityAnim !== myNon.opacityAnim || nextNon.icon !== myNon.icon;
  }

  render() : React.Node {
    const {
      x, y,
      innerRadius, outerRadius,
      startAngle, endAngle,
      sideShrink,
      icon: Icon,
      ...otherProps
    } = this.props;
    const fullRadius = innerRadius + outerRadius;
    
    const innerAngleBias = utils.getAngleOffsetFromShrink(innerRadius, sideShrink);
    const outerAngleBias = utils.getAngleOffsetFromShrink(fullRadius, sideShrink);

    const stroke = new utils.Stroke({x, y});
    const insidePosition = stroke.clone();
    const effectiveProps = _.merge({}, svgStyles.segment, otherProps);

    stroke.setCenter()
      .moveDir(innerRadius, startAngle + innerAngleBias)
      .arc(innerRadius, endAngle - innerAngleBias)
      .lineDirFromCenter(fullRadius, endAngle - outerAngleBias)
      .arc(fullRadius, startAngle + outerAngleBias);

    const { x: tx, y: ty } = insidePosition.moveDir(
      this.props.contentOffset + innerRadius + outerRadius / 2,
      startAngle + (endAngle - startAngle) / 2,
    ).current;

    const { width, height } = this.props;

    return (
      <AnimatedSvg
        width={width} height={height}
        style={[
          styles.segmentContainer,
          {width, height, opacity: this.props.opacityAnim}
        ]}
      >
        <Path
          d={stroke.result}
          {...effectiveProps}
        />
        {Icon && (
          <G transform={`translate(${tx}, ${ty})`}>
            <Icon />
          </G>
        )}
      </AnimatedSvg>
    );
  }
}