// @flow

export type Segment = {
  id: string,
  icon: string,
  color?: string,
  value?: number,
};

export type SegmentList = Array<Segment>;

export type SegmentDesc = {
  segment: Segment,
  startAngle: number,
  endAngle: number,
};

export type SegmentGroupDesc = {
  name: string,
  color: string,
  startAngle: number,
  endAngle: number,
  totalValue: number,
};