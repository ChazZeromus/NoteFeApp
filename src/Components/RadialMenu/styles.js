// @flow
import { StyleSheet } from 'react-native';

const style : StyleSheet.Styles = {
  dial: {
    flex: 0,
  },
  segmentContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  dialModalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  }
};

export default StyleSheet.create(style);

export const svgStyles = {
  container: {
    width: "150",
    height: "150",
  },
  segment: {
    stroke: "none",
    fill: "#f00",
    fillOpacity: "0.7"
  },
};

export const segmentInnerRadius = 20;
export const segmentThickness = 40;