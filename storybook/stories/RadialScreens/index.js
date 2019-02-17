// @flow
import * as React from 'react';
import { Button, Text, Image, View, StyleSheet } from 'react-native';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import Svg, { Circle } from 'react-native-svg';

import RadialScreens from '../../../src/Components/RadialScreens';
import RadialSegment from '../../../src/Components/RadialScreens/RadialSegment';
import Dial from '../../../src/Components/RadialScreens/Dial';
import * as types from '../../../src/Components/RadialScreens/types';

storiesOf('Radial Screens', module)
  .addDecorator(withKnobs)
  .add('Segment Test', () => (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'wrap', flex: 1 }}>
      {Array(24).fill().map((_, i) => {
        const start = i * 10;
        const end = i * 10 + {"0" : 30, "1": 90, "2": 120, "3": 180, "4": 220}[i % 5];
        return (
          <View key={i} style={{ borderWidth: 1, borderColor: '#000', flex: 0 }}>
            <Svg width="100" height="100">
              <Circle cx="50" cy="50" r="3" fill="pink" />
              <RadialSegment
                innerRadius={15}
                thickness={35}
                x={50}
                y={50}
                startAngle={start}
                endAngle={end}
                fill="#f00"
                fillOpacity="0.5"
              />
            </Svg>
            <Text style={{ position: 'absolute', left: 0, top: 0, }}>
              Start: {start}
              End: {end}
            </Text>
          </View>
        );
      })}
    </View>
  ))
  .add('Segment >180', () => (
    <Svg width="100" height="100">
      <Circle cx="50" cy="50" r="3" fill="pink" />
      <RadialSegment
        innerRadius={15}
        thickness={35}
        x={50}
        y={50}
        startAngle={190}
        endAngle={410}
        fill="#f00"
        fillOpacity="0.5"
      />
    </Svg>
  ));