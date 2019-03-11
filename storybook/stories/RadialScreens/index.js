// @flow
import * as React from 'react';
import { Button, Text, Image, View, StyleSheet, Animated } from 'react-native';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import Svg, { Circle, G } from 'react-native-svg';

import * as Icons from '../../../src/Components/Icons';
const NextIcon = Icons.Next;

import CenterView from '../CenterView';
import Panner from '../TestComponents/Panner';
import { RadialPanResponder } from '../../../src/Components/RadialMenu';
import RadialSegment from '../../../src/Components/RadialMenu/Segment';
import Dial from '../../../src/Components/RadialMenu/Dial';
import * as types from '../../../src/Components/RadialMenu/types';

function angleList(total: number, slice: number) : Array<[number, number]> {
  return Array(total / slice).fill(0).map((_, i) => [i * slice, i * slice + slice]);
}

const dialStyle: types.DialStyle = {
  position: { x: 0, y: 0 },
  selector: { x: 150, y: 150 },
  innerRadius: 50,
  outerRadius: 100,
  segmentMargin: 4,
  knobRadius: 40,
  knobColor: 'black',
  knobOpacity: 0.7,
};

const testSegmentList = angleList(360, 45).map(([start, end], i) => ({
  startAngle: start,
  endAngle: end,
  segment: {
    id: `test-${i}`,
    icon: 'Next',
  }
}));

class TestDialPanner extends React.Component<{}> {
  render() : React.Node {
    return (
      <Panner>
        {(panHandlers, animX, animY) => (
          <View
            style={{ flex: 1, backgroundColor: '#335', justifyContent: 'center' }}
            {...panHandlers}
          >
          </View>
        )}
      </Panner>
    );
  }
}

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
                width={100}
                height={100}
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
        width={100}
        height={100}
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
        width={100}
        height={100}
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
        width={100}
        height={100}
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
        width={100}
        height={100}
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
      {angleList(360, 45).map(([start, end], i) => (
        <RadialSegment
          width={300}
          height={300}
          key={i}
          innerRadius={50}
          outerRadius={100}
          x={150}
          y={150}
          startAngle={start}
          endAngle={end}
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
        width={100}
        height={100}
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
        width={100}
        height={100}
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
        width={100}
        height={100}
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
        width={100}
        height={100}
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
        width={200}
        height={200}
        innerRadius={25}
        outerRadius={45}
        x={100}
        y={100}
        startAngle={80}
        endAngle={100}
        contentOffset={7}
        icon={NextIcon}
      />

      <RadialSegment
        width={200}
        height={200}
        innerRadius={25}
        outerRadius={45}
        x={100}
        y={100}
        startAngle={80 + 180}
        endAngle={100 + 180}
        contentOffset={7}
        icon={NextIcon}
      />

      <RadialSegment
        width={200}
        height={200}
        innerRadius={25}
        outerRadius={45}
        x={100}
        y={100}
        startAngle={135}
        endAngle={180}
        contentOffset={7}
        icon={NextIcon}
      />
    </Svg>
  ))
  .add('Segment custom', () => (
    <Svg width="140" height="140">
      <Circle cx="70" cy="70" r="3" fill="pink" />
      <RadialSegment
        width={140}
        height={140}
        innerRadius={20}
        outerRadius={50}
        x={70}
        y={70}
        fill="green"
        startAngle={number('start angle', 0)}
        endAngle={number('end angle', 270)}
      />
      <RadialSegment
        width={140}
        height={140}
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
  .add('Dial', () => (
    <Dial
      dialStyle={dialStyle}
      segmentList={testSegmentList}
      activeIndex={number('active index', -1)}
    />
  ))
  .add('Radial Menu modal with panner', () => (
    <RadialPanResponder segmentList={testSegmentList}>
      {(panHandlers, renderOverlay) => (
        <View
          {...panHandlers}
          style={{ flex: 1, backgroundColor: '#3aa' }}
        >
          <Text>This is some test text</Text>
          {renderOverlay()}
        </View>
      )}
    </RadialPanResponder>
  ))