// @flow
import React from 'react';
import { Text } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import PlaylistEntry from '../../../src/Components/Playlist/PlaylistEntry';

storiesOf('Playlist', module)
  .add('Playlist Entry', () => (
    <PlaylistEntry
      index={1}
      duration={330}
      title="Artist - Title"
    />
  ))