// @flow
import * as React from 'react';
import { View } from 'react-native';
import Svg, { Ellipse, Circle, Defs, LinearGradient, Stop, Path } from 'react-native-svg';

import styles, { svgStyles, segmentStyle } from './styles';

type Props = {};
type State = {};

type SegmentProps = {
  x: number,
  y: number,
  innerRadius: number,
  thickness: number,
  startAngle: number,
  endAngle: number,
};

type Coord = {x: number, y: number};

function xyToDir(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) : Coord {
  const angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function angleFromCoords(p1: Coord, p2: Coord) : number {
  // const angle = Math.atan2(p2.x - p1.x, p1.y - p2.y) / Math.PI * 180;
  let rads = Math.atan2(p2.x - p1.x, p1.y - p2.y);
  if (rads < 0) {
    rads += Math.PI * 2;
  }
  return rads / Math.PI * 180;
}

class Stroke {
  current: Coord;
  centerCurrent: ?Coord = null;
  _result: string;

  constructor(origin: Coord) {
    this.current = origin;
    this._result = `M ${origin.x} ${origin.y}`;
  }

  get x() : number { return this.current.x; }
  get y() : number { return this.current.y; }
  get result() : string { return this._result + ' z'; }

  lineDir(angle: number, length: number) : Stroke {
    this.current = xyToDir(this.current.x, this.current.y, length, angle);
    this._result += ` L ${this.x} ${this.y}`;

    return this;
  }

  moveDir(angle: number, length: number) : Stroke {
    this.current = xyToDir(this.current.x, this.current.y, length, angle);
    this._result += ` M ${this.x} ${this.y}`;
    return this;
  }

  setCenter(center?: Coord) : Stroke {
    this.centerCurrent = center || this.current;
    return this;
  }

  arc(radius: number, angle: number, func?: (...a: any) => void) : Stroke {
    if (!this.centerCurrent) {
      throw new Error('Arc center not set!');
    }

    const { centerCurrent } = this;
    const { x: ax, y: ay } = centerCurrent;

    const end = xyToDir(ax, ay, radius, angle);
    const centerAngleStart = angleFromCoords(centerCurrent, this.current);
    const endAngle = angleFromCoords(centerCurrent, end);
    const totalAngle = endAngle - centerAngleStart;

    const sweep = totalAngle > 0;
    const large = Math.abs(totalAngle) >= 180;
    this._result += ` A ${radius} ${radius} 0 ${Number(large)} ${Number(sweep)} ${end.x} ${end.y}`;
    this.current = end;

    return this;
  }
}

function Segment(
 {x, y, innerRadius, thickness, startAngle, endAngle}: SegmentProps
) : React.Node {
  const stroke = new Stroke({x, y});
  stroke.setCenter()
    .moveDir(startAngle, innerRadius)
    .arc(innerRadius, endAngle)
    .lineDir(endAngle, thickness)
    .arc(innerRadius + thickness, startAngle);

  return (
    <Path
      d={`${stroke.result}`}
      stroke="#f00"
      fill="green"
      fillOpacity="0.5"
      strokeOpacity="0.5"
    />
  );
}

export default class Dial extends React.Component<Props, State> {
  render() : React.Node {
    return (
      <View style={[styles.dial, { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'wrap', flex: 1}]}>
        {Array(20).fill().map((_, i) => (
          <View key={i} style={{ borderWidth: 1, borderColor: '#000', flex: 0 }}>
            <Svg width="100" height="100">
              <Circle cx="50" cy="50" r="3" fill="pink" />
              <Segment innerRadius={15} thickness={35} x={50} y={50} endAngle={330} startAngle={i * 15} />
            </Svg>
          </View>
        ))}
      </View>
    )
  }
}