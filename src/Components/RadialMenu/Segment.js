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
  children?: React.Node,
  selected?: boolean,
};

export default class Segment extends React.PureComponent<Props> {
  static defaultProps = {
    contentOffset: 0,
    sideShrink: 0,
  }

  opacityAnim: Animated.Value = new Animated.Value(0.7);

  componentDidUpdate(props: Props) {
    const { selected } = this.props;
    if (props.selected !== selected) {
      Animated.timing(
        this.opacityAnim, {
          toValue: selected ? 1 : 0.7,
          duration: 70,
          useNativeDriver: true,
        }
      ).start();
    }
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

    const { width, height } = this.props;

    return (
      <AnimatedSvg
        width={width} height={height}
        style={[
          styles.segmentContainer,
          {width, height, opacity: this.opacityAnim}
        ]}
      >
        <Path
          d={stroke.result}
          {...effectiveProps}
        />
        <G transform={`translate(${tx}, ${ty})`}>
          {children}
        </G>
      </AnimatedSvg>
    );
  }
}