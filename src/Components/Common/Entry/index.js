// @flow
import * as React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

type Props = { children?: React.Node };
export default class Entry extends React.PureComponent<Props> {
  render() : React.Node {
    return (
      <View style={styles.entry}>
        {this.props.children}
      </View>
    );
  }
}