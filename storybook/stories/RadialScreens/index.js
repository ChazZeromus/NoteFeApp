// @flow
import * as React from 'react';
import { Button, Text, Image, View, StyleSheet } from 'react-native';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';

import RadialScreens from '../../../src/Components/RadialScreens';
import Dial from '../../../src/Components/RadialScreens/Dial';
import * as types from '../../../src/Components/RadialScreens/types';

storiesOf('Radial Screens', module)
  .addDecorator(withKnobs)
  .add('Dial', () => (
    <Dial />
  ));