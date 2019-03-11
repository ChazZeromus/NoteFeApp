// @flow
import * as React from 'react';

export type Coord = { x: number, y: number };

export type Segment = {
  id: string,
  icon: string,
  color?: string,
  value?: number,
};

export type SegmentDesc = {
  segment: Segment,
  startAngle: number,
  endAngle: number,
};

export type SegmentDescList = Array<SegmentDesc>;

export type SegmentGroupDesc = {
  name: string,
  color: string,
  startAngle: number,
  endAngle: number,
  totalValue: number,
};

export type RadialContextData = {
  menuRef: ?React.ElementRef<any>,
};

export type DialStyle = {
  position: Coord,
  knobRadius: number,
  knobColor: string,
  knobOpacity: number,
  innerRadius: number,
  outerRadius: number,
  contentOffset?: number,
  segmentMargin?: number,
  containerStyle?: Object,
};