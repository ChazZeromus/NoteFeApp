// @flow
import { StyleSheet } from 'react-native';

const style : StyleSheet.Styles = {
  container: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0, right: 0,
    flex: 1,
    // backgroundColor: '#f00',
  },
  innerContent: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0, right: 0,
    flex: 1,
  },
  blur: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0, right: 0,
    // backgroundColor: '#f00',
  }
};

export default StyleSheet.create(style);