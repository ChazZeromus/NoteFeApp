// @flow
import * as React from 'react';
import { G } from 'react-native-svg';

function wrapIcon(Icon: any, w: number, h: number) : React.ComponentType<Object> {
  const halfWidth = w / 2;
  const halfHeight = h / 2;
  return (props) => (
    <G transform={`translate(${-halfWidth}, ${-halfHeight})`}>
      <Icon width={w} height={h} {...props} />
    </G>
  )
}

import NextIcon from '../../assets/icons/next.svg';
export const Next = wrapIcon(NextIcon, 16, 16);
