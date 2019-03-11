// @flow
import * as React from 'react';
import { View, Text, Animated } from 'react-native';
import Svg, { Circle, Defs, Mask, Rect, G, RadialGradient, Stop } from 'react-native-svg';
import _ from 'lodash';

import styles, { svgStyles } from './styles';
import * as types from './types';
import * as utils from './utils';

import Segment from './Segment';
import * as Icons from '../Icons';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);


type Props = {
  dialStyle: types.DialStyle,
  segmentList: types.SegmentDescList,
  activeIndex: ?number,
};

export default class Dial extends React.PureComponent<Props> {
  animatedValues: Array<Animated.Value> = [];
  circleAnim = new Animated.ValueXY();
  circleAnimEvent = new Animated.event(
    [{ x: this.circleAnim.x, y: this.circleAnim.y }],
  );

  constructor(props: Props) {
    super(props);
    this._refreshAnimatedValues();
  }

  _renderSegment(index: number, desc: types.SegmentDesc, maskOnly: boolean = false) : React.Node {
    const { segmentList, dialStyle, activeIndex } = this.props;
    const { position, innerRadius, outerRadius, contentOffset, segmentMargin } = dialStyle;
    const { startAngle, endAngle, segment } = desc;
    const { id, icon, color } = segment;
    const halfLength = innerRadius + outerRadius;
    const opacityAnim = index < this.animatedValues.length ? this.animatedValues[index] : undefined;

    if (opacityAnim) {
      Animated.timing(
        opacityAnim,
        {
          useNativeDriver: true,
          toValue: this.props.activeIndex === index ? 1 : 0.6,
          duration: 70,
        }
      ).start();
    }

    const iconComponent = Icons[icon] || undefined;

    let segmentProps = {
      key: maskOnly ? `${id}-mask` : id,
      startAngle, endAngle,
      x: halfLength,
      y: halfLength,
      innerRadius,
      outerRadius,
      contentOffset,
      width: halfLength * 2,
      height: halfLength * 2,
      fill: maskOnly ? '#fff' : color,
      fillOpacity: maskOnly ? "1" : undefined,
      sideShrink: typeof segmentMargin === 'number' ? segmentMargin / 2 : undefined,
      segmentIndex: index,
      opacityAnim,
      icon: iconComponent,
    };

    const IconComponent = !maskOnly && icon ? Icons[icon] : null;

    return (
      <Segment {...segmentProps}>
        {IconComponent ? <IconComponent /> : null}
      </Segment>
    );
  }

  componentDidUpdate(prevProps: Props) {
    if (_.isEqual(prevProps.segmentList, this.props.segmentList)) {
      return;
    }

    this._refreshAnimatedValues();
  }

  _refreshAnimatedValues() {
    this.animatedValues = [...Array(this.props.segmentList.length).fill(() => new Animated.Value(0.7)).map(f => f())];
  }

  setCirclePosition(pos: types.Coord) {
    this.circleAnimEvent(pos);
  }

  render() : React.Node {
    const { segmentList } = this.props;
    const {
      containerStyle,
      position,
      innerRadius,
      outerRadius,
      knobRadius,
      knobColor,
      knobOpacity,
    } = this.props.dialStyle;
    const length = (innerRadius + outerRadius) * 2;

    return (
      <View style={[
        styles.dial,
        {
          width: length,
          height: length,
          transform: [
            { translateX: position.x },
            { translateY: position.y },
          ]
        },
        containerStyle,
      ]}>
        <Animated.View
          style={{
            position: 'absolute',
            ...this.circleAnim.getLayout(),
          }}
        >
          <Svg width={length} height={length}>
            <Circle
              cx={length / 2}
              cy={length / 2}
              r={knobRadius}
              fill={knobColor}
              fillOpacity={knobOpacity}
            />
          </Svg>
        </Animated.View>
        {segmentList.map((desc, i) => this._renderSegment(i, desc, false))}
      </View>
    )
  }
}
