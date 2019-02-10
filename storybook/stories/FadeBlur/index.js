// @flow
import * as React from 'react';
import { Button, Text, Image, View, StyleSheet } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import testImage from '../../../src/assets/test-image.jpg';

import PlaylistEntry from '../../../src/Components/Playlist/PlaylistEntry';
import { BlurBackground, FadeBlur } from '../../../src/Components/FadeBlur';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  absolute: {
    position: "absolute",
    top: 0, left: 0,
  },
});

type State = {
  showBlur: boolean,
};

class TestComponent extends React.Component<{}, State> {
  viewRef: ?React.ElementRef<View> = null;
  state: State = {
    showBlur: false,
  };

  render() : React.Node {
    return (
      <BlurBackground>
        {BlurView => (
          <>
            <BlurView style={{ backgroundColor: '#ddd' }}>
              <Button title="Blur" onPress={() => this.setState({ showBlur: true })} />
            </BlurView>
            <FadeBlur visible={this.state.showBlur} contentStyle={{ justifyContent: 'flex-start' }}>
              <PlaylistEntry index={1} duration={330} title="Artist - Title" />
              <PlaylistEntry index={1} duration={330} title="Artist - Title" />
              <PlaylistEntry index={1} duration={330} title="Artist - Title" />
              <PlaylistEntry index={1} duration={330} title="Artist - Title" />
              <PlaylistEntry index={1} duration={330} title="Artist - Title" />
              <Button title="Close" onPress={() => this.setState({ showBlur: false })} />
            </FadeBlur>
          </>
        )}
      </BlurBackground>
    );
  }
}

storiesOf('Blur Test', module)
  .add('Playlist Blur', () => <TestComponent />);