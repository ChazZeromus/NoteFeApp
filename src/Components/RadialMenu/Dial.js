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

// const AnimatedRadialGradient = Animated.createAnimatedComponent(RadialGradient);

type Props = {
  dialStyle: types.DialStyle,
  segmentList: types.SegmentDescList,
  activeIndex: ?number,
};

export default class Dial extends React.PureComponent<Props> {
  animatedValues: Array<Animated.Value> = [];

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

  render() : React.Node {
    const { segmentList } = this.props;
    const { containerStyle, position, innerRadius, outerRadius } = this.props.dialStyle;
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
        {
        // <Defs>
        //   <Mask id="dial-mask">
        //     <Rect x="0" y="0" width={length} height={length} fill="#000" />
        //     {segmentList.map(desc => this._renderSegment(desc, true))}
        //   </Mask>
        //   <AnimatedRadialGradient id="selector-gradient"
        //     cx={sx}
        //     cy={sy}
        //     fx={sx}
        //     fy={sy}
        //     rx={length}
        //     ry={length}
        //     gradientUnits="userSpaceOnUse"
        //   >
        //     <Stop offset="0" stopColor="#fff" stopOpacity="0.8" />
        //     <Stop offset="0.1" stopColor="#fff" stopOpacity="0.8" />
        //     <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        //   </AnimatedRadialGradient>
        // </Defs>
        segmentList.map((desc, i) => this._renderSegment(i, desc, false))
          // <Rect
          //   x={0} y={0}
          //   width="100%"
          //   height="100%"
          //   fill="url(#selector-gradient)"
          //   mask="url(#dial-mask)"
          // />
        }
      </View>
    )
  }
}
