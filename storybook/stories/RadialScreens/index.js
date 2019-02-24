// @flow
import * as React from 'react';
import { Button, Text, Image, View, StyleSheet } from 'react-native';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import Svg, { Circle, G } from 'react-native-svg';

import * as Icons from '../../../src/Components/Icons';
const NextIcon = Icons.Next;

import CenterView from '../CenterView';
import RadialScreens from '../../../src/Components/RadialScreens';
import RadialSegment from '../../../src/Components/RadialScreens/Segment';
import Dial from '../../../src/Components/RadialScreens/Dial';
import * as types from '../../../src/Components/RadialScreens/types';

storiesOf('Radial Screens', module)
  .addDecorator(withKnobs)
  .addDecorator(storyFn => (
    <CenterView>
      <View style={{ flex: 0, backgroundColor: '#aaf' }}>
        {storyFn()}
      </View>
    </CenterView>
  ))
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
                outerRadius={35}
                x={50}
                y={50}
                startAngle={start}
                endAngle={end}
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
        outerRadius={35}
        x={50}
        y={50}
        startAngle={190}
        endAngle={410}
      />
    </Svg>
  ))
  .add('Segments Adjacent Uneven', () => (
    <Svg width="100" height="100">
      <Circle cx="50" cy="50" r="3" fill="pink" />
      <RadialSegment
        innerRadius={15}
        outerRadius={35}
        x={50}
        y={50}
        startAngle={0}
        endAngle={45}
        fill="blue"
        sideShrink={number('Side shrink', 1)}
      />
      <RadialSegment
        innerRadius={15}
        outerRadius={35}
        x={50}
        y={50}
        startAngle={45}
        endAngle={250}
        fill="green"
        sideShrink={number('Side shrink', 1)}
      />
      <RadialSegment
        innerRadius={15}
        outerRadius={35}
        x={50}
        y={50}
        startAngle={250}
        endAngle={360}
        fill="orange"
        sideShrink={number('Side shrink', 1)}
      />
    </Svg>
  ))
  .add('Segments Adjacent Evenly', () => (
    <Svg width="300" height="300">
      <Circle cx="150" cy="150" r="3" fill="pink" />
      {Array(360 / 90).fill(0).map((_, i) => (
        <RadialSegment
          key={i}
          innerRadius={50}
          outerRadius={100}
          x={150}
          y={150}
          startAngle={90 * i}
          endAngle={90 * i + 90}
          fill={{'0': 'blue', '1': 'green', '2': 'orange'}[i % 3]}
          sideShrink={number('Side shrink', 1)}
        />
      ))}
    </Svg>
  ))
  .add('Segments Adjacent with large-arcs', () => (
    <Svg width="100" height="100">
      <Circle cx="50" cy="50" r="3" fill="pink" />
      <RadialSegment
        innerRadius={15}
        outerRadius={35}
        x={50}
        y={50}
        startAngle={0}
        endAngle={190}
        fill="blue"
        sideShrink={number('Side shrink', 1)}
      />
      <RadialSegment
        innerRadius={15}
        outerRadius={35}
        x={50}
        y={50}
        startAngle={190}
        endAngle={360}
        fill="green"
        sideShrink={number('Side shrink', 1)}
      />
    </Svg>
  ))
  .add('Segments Adjacent with large-arcs (reversed)', () => (
    <Svg width="100" height="100">
      <Circle cx="50" cy="50" r="3" fill="pink" />
      <RadialSegment
        innerRadius={15}
        outerRadius={35}
        x={50}
        y={50}
        startAngle={0}
        endAngle={150}
        fill="blue"
        sideShrink={number('Side shrink', 1)}
      />
      <RadialSegment
        innerRadius={15}
        outerRadius={35}
        x={50}
        y={50}
        startAngle={150}
        endAngle={360}
        fill="green"
        sideShrink={number('Side shrink', 1)}
      />
    </Svg>
  ))
  .add('Segment with icon', () => (
    <Svg width="200" height="200">
      <Circle cx="100" cy="100" r="3" fill="pink" />
      <RadialSegment
        innerRadius={25}
        outerRadius={45}
        x={100}
        y={100}
        startAngle={80}
        endAngle={100}
        contentOffset={7}
      >
        <G transform="translate(-8, -8)" opacity="0.5">
          <NextIcon width={16} height={16} />
        </G>
      </RadialSegment>

      <RadialSegment
        innerRadius={25}
        outerRadius={45}
        x={100}
        y={100}
        startAngle={80 + 180}
        endAngle={100 + 180}
        contentOffset={7}
      >
        <G transform="rotate(180) translate(-8, -8)" opacity="0.5">
          <NextIcon width={16} height={16} />
        </G>
      </RadialSegment>

      <RadialSegment
        innerRadius={25}
        outerRadius={45}
        x={100}
        y={100}
        startAngle={135}
        endAngle={180}
        contentOffset={7}
      >
        <G transform="rotate(180) translate(-8, -8)" opacity="0.5">
          <NextIcon width={16} height={16} />
        </G>
      </RadialSegment>
    </Svg>
  ))
  .add('Dial', () => (
    <Dial
      position={{ x: 0, y: 0 }}
      selector={{ x: 130, y: 70 }}
      innerRadius={20}
      outerRadius={50}
      segmentList={[
        {
          startAngle:45,
          endAngle: 135,
          segment: {
            id: 'test',
            icon: 'Next',
          }
        }
      ]}
    />
  ))
  .add('Segment custom', () => (
    <Svg width="140" height="140">
      <Circle cx="70" cy="70" r="3" fill="pink" />
      <RadialSegment
        innerRadius={20}
        outerRadius={50}
        x={70}
        y={70}
        fill="green"
        startAngle={number('start angle', 0)}
        endAngle={number('end angle', 270)}
      />
      <RadialSegment
        innerRadius={20}
        outerRadius={50}
        x={70}
        y={70}
        fill="white"
        fillOpacity="0.6"
        startAngle={number('start angle', 0)}
        endAngle={number('end angle', 270)}
        sideShrink={number('side shrink', 0)}
      />
    </Svg>
  ))