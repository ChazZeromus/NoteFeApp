// @flow
import * as React from 'react';
import { Button, Text, Image, View, StyleSheet } from 'react-native';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';

import CardScreens from '../../../src/Components/CardScreens';
import * as types from '../../../src/Components/CardScreens/types';

const Screen1 = (props: types.ScreenProps) => (
  <props.PanBaseView>
    <Text>Screen 1</Text>
  </props.PanBaseView>
);

const Screen2 = (props: types.ScreenProps) => (
  <props.PanBaseView>
    <Text>Screen 2</Text>
  </props.PanBaseView>
);

const Screen3 = (props: types.ScreenProps) => (
  <props.PanBaseView>
    <Text>Screen 3</Text>
  </props.PanBaseView>
);

const routes = [
  { id: 'screen1', screen: Screen1 },
  { id: 'screen2', screen: Screen2 },
  { id: 'screen3', screen: Screen3 },
];

storiesOf('Card Screens', module)
  .addDecorator(withKnobs)
  .add('Three screen test', () => (
    <CardScreens routes={routes} initialRoute="screen1" />
  ));