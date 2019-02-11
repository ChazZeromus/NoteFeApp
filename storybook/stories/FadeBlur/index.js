// @flow
import * as React from 'react';
import { Button, Text, Image, View, StyleSheet } from 'react-native';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import LinearGradient from 'react-native-linear-gradient';

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
            <BlurView style={{ backgroundColor: '#fff' }}>
              {boolean('show image', false) && (
                <Image
                  resizeMode="cover"
                  source={testImage}
                  style={[styles.absolute, { right: 0, bottom: 0 }]}
                />
              )}
              <Button title="Blur" onPress={() => this.setState({ showBlur: true })} />
            </BlurView>
            <FadeBlur
              visible={this.state.showBlur}
              contentStyle={{ justifyContent: 'flex-start' }}
              preferVibrancy={boolean('prefer vibrancy', true)}
            >
              {boolean('show gradient', true) && (
                <LinearGradient
                  start={{x: 0.0, y: 2}} end={{x: 0, y: -1}}
                  locations={[0,0.6]}
                  colors={['rgb(255, 255, 255)', 'rgba(255, 255, 255, 0)']}
                  style={[styles.absolute, { right: 0, bottom: 0}]}>
                </LinearGradient>
              )}
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
  .addDecorator(withKnobs)
  .add('Playlist Blur', () => <TestComponent />);