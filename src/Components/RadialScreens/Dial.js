// @flow
import * as React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import styles, { svgStyles, segmentStyle } from './styles';

import RadialSegment from './RadialSegment';

type Props = {};
type State = {};

export default class Dial extends React.Component<Props, State> {
  render() : React.Node {
    return (
      <View style={[styles.dial]}>
      </View>
    )
  }
}