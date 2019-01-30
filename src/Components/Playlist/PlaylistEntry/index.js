// @flow
import * as React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

import * as Utils from '../../../Utils';
import Entry from '../../Common/Entry';

type Props = {
  index: number,
  title: string,
  duration: number,
}
export default function PlaylistEntry({index, title, duration}: Props): React.Node {
  return (
    <Entry>
      <View style={styles.left}>
        <Text style={[styles.text, styles.indexText]}>{index}</Text>
        <Text style={[styles.text, styles.titleText]}>{title}</Text>
      </View>
      <Text style={[styles.text, styles.timeText]}>
        {Utils.formatSeconds(duration)}
      </Text>
    </Entry>
  );
}