// @flow
import * as React from 'react';
import { Button, Text, Image, View, StyleSheet } from 'react-native';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';

import CardScreens from '../../../src/Components/CardScreens';
import * as types from '../../../src/Components/CardScreens/types';

const Screen = (props: types.ScreenProps) => (
  <View style={{ flex: 1, backgroundColor: props.isReady ? '#afa' : '#aaa' }} {...props.panHandlers}>
    <Text>{props.routeId}</Text>
  </View>
);

const routes = [
  { id: 'screen1', screen: Screen },
  { id: 'screen2', screen: Screen },
  { id: 'screen3', screen: Screen },
  { id: 'screen4', screen: Screen },
  // { id: 'screen3', screen: Screen3 },
];

storiesOf('Card Screens', module)
  .addDecorator(withKnobs)
  .add('Three screen test', () => (
    <CardScreens routes={routes} initialRoute="screen1" />
  ));