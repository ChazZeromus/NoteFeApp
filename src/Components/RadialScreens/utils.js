// @flow
import type { Coord } from './types';

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
  _currentCenter: ?Coord = null;
  // Used to perserve angle of last arc in relation to center point, as opposed
  // to calculating angle on-the-fly between center and current points.
  lastArcAngle: ?number = null;
  // Path attribute value to use for SVG Path component
  _result: string;

  constructor(origin: Coord | Stroke) {
    if (origin instanceof Stroke) {
      this.current = origin.current;
      this._currentCenter = origin._currentCenter;
      this.lastArcAngle = origin.lastArcAngle;
      this._result = origin._result;
    } else {
      this.current = origin;
      this._result = `M ${origin.x} ${origin.y}`;
    }
  }

  clone() : Stroke {
    return new Stroke(this);
  }
  
  get currentCenter() : Coord {
    const { _currentCenter } = this;
    if (!_currentCenter) {
      throw new Error('Arc center not set!');
    }

    return _currentCenter;
  }

  get x() : number { return this.current.x; }
  get y() : number { return this.current.y; }
  get result() : string { return this._result + ' z'; }

  _updateArcAngle(newAngle: number) {
    // Recalculate if new angle is different, otherwise angles greater than 360 degrees
    // could be wrapped.
    if (this._currentCenter && newAngle !== this.lastArcAngle) {
      this.lastArcAngle = angleFromCoords(this.currentCenter, this.current);
    }
  }

  lineDir(length: number, angle: number) : Stroke {
    this.current = xyToDir(this.x, this.y, length, angle);
    this._updateArcAngle(angle);

    this._result += ` L ${this.x} ${this.y}`;

    return this;
  }

  lineDirFromCenter(length: number, angle: number) : Stroke {
    const { x, y } = this.currentCenter;
    this.current = xyToDir(x, y, length, angle);
    this._updateArcAngle(angle);
    this._result += ` L ${this.x} ${this.y}`;
    return this;
  }

  moveDir(length: number, angle: number) : Stroke {
    this.current = xyToDir(this.x, this.y, length, angle);
    this._updateArcAngle(angle);

    this._result += ` M ${this.x} ${this.y}`;
    return this;
  }

  setCenter(center?: Coord) : Stroke {
    this._currentCenter = center || this.current;
    return this;
  }

  arc(radius: number, angle: number) : Stroke {
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

// Function used to determine a slight angle bias to ensure a gap of `shrinkSize` between
// radial segments.
export function getAngleOffsetFromShrink(radius: number, shrinkSize: number) : number {
  const ratio = shrinkSize / radius;
  const angle = Math.asin(ratio) / Math.PI * 180;
  return angle;
}