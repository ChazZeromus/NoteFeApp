// @flow
import * as React from 'react';
import { View } from 'react-native';

import styles from './styles';

type Props = {};
type State = {};

export default class Dial extends React.Component<Props, State> {
  render() : React.Node {
    return (
      <View style={styles.dial}>
      </View>
    )
  }
}