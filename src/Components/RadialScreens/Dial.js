// @flow
import * as React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Defs, Mask, Rect, G, RadialGradient, Stop } from 'react-native-svg';

import styles, { svgStyles } from './styles';
import * as types from './types';

import Segment from './Segment';
import * as Icons from '../Icons';

type Props = {
  position: types.Coord,
  selector?: types.Coord,
  innerRadius: number,
  outerRadius: number,
  segmentList: types.SegmentDescList,
  contentOffset?: number,
};

export default class Dial extends React.PureComponent<Props> {
  _renderSegment(desc: types.SegmentDesc, maskOnly: boolean = false) : React.Node {
    const { position, innerRadius, outerRadius, contentOffset } = this.props;
    const { startAngle, endAngle, segment } = desc;
    const { id, icon, color } = segment;
    const halfLength = innerRadius + outerRadius;

    let segmentProps = {
      key: maskOnly ? `${id}-mask` : id,
      startAngle, endAngle,
      x: halfLength,
      y: halfLength,
      innerRadius,
      outerRadius,
      contentOffset,
      fill: maskOnly ? '#fff' : color,
      fillOpacity: maskOnly ? "1" : undefined,
    };

    const IconComponent = maskOnly && icon ? Icons[icon] : null;

    return (
      <Segment {...segmentProps}>
        {IconComponent ? <IconComponent /> : null}
      </Segment>
    );
  }


  render() : React.Node {
    const { position, segmentList, innerRadius, outerRadius, selector } = this.props;
    const length = (innerRadius + outerRadius) * 2;

    const { x: sx, y: sy } = selector ? selector : { x: length / 2, y: length / 2 };

    return (
      <View style={[
        styles.dial,
        {
          width: length,
          height: length,
          backgroundColor: '#aaa',
          transform: [
            { translateX: position.x },
            { translateY: position.y },
          ]
        }
      ]}>
        <Svg width={length} height={length}>
          <Defs>
            <Mask id="dial-mask">
              <Rect x="0" y="0" width={length} height={length} fill="#000" />
              {segmentList.map(desc => this._renderSegment(desc, true))}
            </Mask>
            <RadialGradient id="selector-gradient"
              cx={sx}
              cy={sy}
              fx={sx}
              fy={sy}
              rx={length}
              ry={length}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor="#fff" stopOpacity="0.8" />
              <Stop offset="0.1" stopColor="#fff" stopOpacity="0.8" />
              <Stop offset="1" stopColor="#fff" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          {segmentList.map(desc => this._renderSegment(desc, false))}
          <Rect
            x={0} y={0}
            width="100%"
            height="100%"
            fill="url(#selector-gradient)"
            mask="url(#dial-mask)"
          />
        </Svg>
      </View>
    )
  }
}
