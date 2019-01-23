import { AppRegistry } from 'react-native';

// NOTE: Storybook cannot go after App or else we get a wierd react child
// render error.
import StorybookUI from './storybook';
import App from './src/App';
import { name as appName } from './app.json';


AppRegistry.registerComponent(appName, () => __DEV__ ? StorybookUI : App);
