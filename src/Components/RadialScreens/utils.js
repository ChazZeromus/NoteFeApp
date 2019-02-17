// @flow

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
  let rads = Math.atan2(p2.x - p1.x, p1.y - p2.y);
  if (rads < 0) {
    rads += Math.PI * 2;
  }
  return rads / Math.PI * 180;
}

export class Stroke {
  // Current point of stroke
  current: Coord;
  // Used to keep track of the center of the cricle used to stroke arcs.
  currentCenter: ?Coord = null;
  // Used to perserve angle of last arc in relation to center point, as opposed
  // to calculating angle on-the-fly between center and current points.
  lastArcAngle: ?number = null;
  // Path attribute value to use for SVG Path component
  _result: string;

  constructor(origin: Coord) {
    this.current = origin;
    this._result = `M ${origin.x} ${origin.y}`;
  }

  get x() : number { return this.current.x; }
  get y() : number { return this.current.y; }
  get result() : string { return this._result + ' z'; }

  _updateArcAngle(newAngle: number) {
    const { currentCenter } = this;
    // Recalculate if new angle is different, otherwise angles greater than 360 degrees
    // could be wrapped.
    if (currentCenter && newAngle !== this.lastArcAngle) {
      this.lastArcAngle = angleFromCoords(currentCenter, this.current);
    }
  }

  lineDir(angle: number, length: number) : Stroke {
    this.current = xyToDir(this.x, this.y, length, angle);
    this._updateArcAngle(angle);

    this._result += ` L ${this.x} ${this.y}`;

    return this;
  }

  moveDir(angle: number, length: number) : Stroke {
    this.current = xyToDir(this.x, this.y, length, angle);
    this._updateArcAngle(angle);

    this._result += ` M ${this.x} ${this.y}`;
    return this;
  }

  setCenter(center?: Coord) : Stroke {
    this.currentCenter = center || this.current;
    return this;
  }

  arc(radius: number, angle: number) : Stroke {
    if (!this.currentCenter) {
      throw new Error('Arc center not set!');
    }

    const { currentCenter } = this;
    const { x: ax, y: ay } = currentCenter;

    const end = xyToDir(ax, ay, radius, angle);

    const { lastArcAngle } = this;
    const centerAngleStart: number = typeof lastArcAngle === 'number'
      ? lastArcAngle
      : angleFromCoords(currentCenter, this.current);

    const totalAngle = angle - centerAngleStart;

    const sweep = totalAngle > 0;
    const large = Math.abs(totalAngle) >= 180;
    this._result += ` A ${radius} ${radius} 0 ${Number(large)} ${Number(sweep)} ${end.x} ${end.y}`;
    this.current = end;
    this.lastArcAngle = angle;

    return this;
  }
}