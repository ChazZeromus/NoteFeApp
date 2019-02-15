// @flow
import { StyleSheet } from 'react-native';
import globalStyle from '../../../styles';

const style : StyleSheet.Styles = {
  left: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  indexText: {
    marginRight: 10,
  },
  titleText: {

  },
  timeText: {
  },
  text: {
    ...globalStyle.text
  },
};

export default StyleSheet.create(style);