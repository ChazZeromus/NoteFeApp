// @flow
import * as React from 'react';
import { AppRegistry, StatusBar, Text } from 'react-native';
import { getStorybookUI, configure, addDecorator } from '@storybook/react-native';
import { name as appName } from '../app.json';

import './rn-addons';

const StatusBarDecorator = (storyFn) => (
  <>
    <StatusBar hidden />
    {storyFn()}
  </>
);

addDecorator(StatusBarDecorator);

// import stories
configure(() => {
  require('./stories');
}, module);

// Refer to https://github.com/storybooks/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({
  onDeviceUI: false,
});

// If you are using React Native vanilla and after installation you don't see your app name here, write it manually.
// If you use Expo you can safely remove this line.
AppRegistry.registerComponent(appName, () => StorybookUIRoot);

export default StorybookUIRoot;
