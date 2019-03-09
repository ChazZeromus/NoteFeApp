// @flow
import * as React from 'react';
import { Button, Text, Image, View, StyleSheet } from 'react-native';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import Svg, { Defs, Pattern, Rect, Path } from 'react-native-svg';

import CardScreens from '../../../src/Components/CardScreens';
import * as types from '../../../src/Components/CardScreens/types';

const SvgGrid = () => (
  <Svg width="100%" height="100%">
    <Defs>
      <Pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
        <Path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" stroke-width="0.5"/>
      </Pattern>
      <Pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
        <Rect width="80" height="80" fill="url(#smallGrid)"/>
        <Path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1"/>
      </Pattern>
    </Defs>

    <Rect width="100%" height="100%" fill="url(#grid)" />
  </Svg>
)

const Screen = (props: types.ScreenProps) => (
  <View style={{ flex: 1, backgroundColor: props.isReady ? '#afa' : '#aaa' }} {...props.panHandlers}>
    <Text>{props.routeId}</Text>
  </View>
);

const GridScreen = (props: types.ScreenProps, color: string, style?: any) => (
  <View style={{ flex: 1, backgroundColor: color, ...style }} {...props.panHandlers}>
    <SvgGrid />
    <Text style={{ position: 'absolute', left: 20, top: 20 }}>{props.routeId} {props.isReady ? 'ready' : 'not ready'}</Text>
  </View>
);

const routes = [
  { id: 'screen1', screen: props => GridScreen(props, '#afa') },
  { id: 'screen2', screen: props => GridScreen(props, '#faa') },
  { id: 'screen3', screen: props => GridScreen(props, '#aaf') },
  { id: 'screen4', screen: props => GridScreen(props, '#999') },
];

storiesOf('Card Screens', module)
  .addDecorator(withKnobs)
  .add('Four screen test', () => (
    <CardScreens routes={routes} initialRoute="screen2" />
  ));