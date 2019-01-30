// @flow
import React from 'react';
import { Text } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import WebSwitchTest from './WebSwitchTest';

storiesOf('Test', module)
  .add('Web-switch client test', () => <WebSwitchTest />);