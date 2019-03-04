// @flow
import { StyleSheet } from 'react-native';

const style : StyleSheet.Styles = {
  panBaseContainer: {
    flex: 1,
    backgroundColor: '#0f0',
    borderWidth: 1,
    borderColor: '#000',
  },
  cardScreensContainer: {
    flex: 1,
  },
  cardStyle: {
    flex: 1,
    backgroundColor: '#533',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
};

export default StyleSheet.create(style);