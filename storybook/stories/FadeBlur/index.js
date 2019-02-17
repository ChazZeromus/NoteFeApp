// @flow
import * as React from 'react';
import { Button, Text, Image, View, StyleSheet, Animated } from 'react-native';
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


class AnimTest extends React.Component<{}, { showView: boolean, visible: boolean }> {
  opacityFade = new Animated.Value(1);
  state = {
    showView: true,
    visible: true,
  }

  componentDidMount() {
    this.opacityFade.addListener(this.handleObserveFade.bind(this));
  }

  handlePress() {
    const visible = !this.state.visible;

    Animated.timing(this.opacityFade, {
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
    }).start();

    this.setState({ visible });
  }

  componentWillUnmount() {
    this.opacityFade.removeAllListeners();
  }

  handleObserveFade({ value }) {
    const shouldShow = value > 0.0;

    if (shouldShow !== this.state.showView) {
      this.setState({ showView: shouldShow });
      // // Uncomment hack to fix bug with useNativeDriver animation not triggering if only
      // // component using animations is unmounted.
      // // Alternatively, have a persistent component uses this.opacityFade to also fix bug.
      // if (!shouldShow) {
      //   this.opacityFade.removeAllListeners();
      //   this.opacityFade.addListener(this.handleObserveFade.bind(this));
      // }
    }
  }

  render() : React.Node {
    return (
      <View>
        <Button title="toggle" onPress={() => this.handlePress()} />
        {this.state.showView && (
          <Animated.View style={{ opacity: this.opacityFade }}>
            <Text>I should fade</Text>
          </Animated.View>
        )}
      </View>
    );
  }
}

storiesOf('Blur Test', module)
  .addDecorator(withKnobs)
  .add('Playlist Blur', () => <TestComponent />)
  .add('Animation listener bug', () => <AnimTest />);