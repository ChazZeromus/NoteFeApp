// @flow

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