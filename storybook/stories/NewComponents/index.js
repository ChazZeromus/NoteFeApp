// @flow
import * as React from 'react';
import { Text, Image, View, findNodeHandle, StyleSheet } from 'react-native';
import { BlurView, VibrancyView } from 'react-native-blur';
import { storiesOf } from '@storybook/react-native';

import testImage from '../../../src/assets/test-image.jpg';

import PlaylistEntry from '../../../src/Components/Playlist/PlaylistEntry';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  absolute: {
    position: "absolute",
    top: 0, left: 0,
    width: '100%', height: '100%',
  },
});

type MenuState = {
  viewRef: ?number,
};
export default class Menu extends React.Component<{}, MenuState> {
  state: MenuState = {
    viewRef: null,
  };
  backgroundImage: ?React.ElementRef<Image>;
  constructor(props: {}) {
    super(props);
    this.state = { viewRef: null };
  }

  imageLoaded() {
    this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          ref={(img) => { this.backgroundImage = img; }}
          style={[styles.absolute, {zIndex: -1}]}
        >
          <Image
            source={testImage}
            style={styles.absolute}
            onLoadEnd={this.imageLoaded.bind(this)}
          />
          <View style={{
            backgroundColor: '#f00',
            width: 100,
            height: 100,
          }} />
        </View>
        {this.state.viewRef && (
          <BlurView
            style={[styles.absolute, {zIndex: 2}]}
            viewRef={this.state.viewRef}
            blurType="light"
            blurAmount={20}
          />
        )}
        <Text style={[styles.absolute, {zIndex: 3}]}>Hi, I am some unblurred text</Text>
      </View>
    );
  }
}

const absolute = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
}

const imageStyle = {
  resizeMode: 'cover',
  zIndex: -1,
};

const blurStyle = {
  position: 'absolute',
  zIndex: 0,
};

const backgroundView = {
  flex: 1,
  alignSelf: 'stretch',
  zIndex: -1,
  backgroundColor: '#0f0',
}

type State = {
  blurRef: ?React.ElementRef<View>,
};

class TestComponent extends React.Component<{}, State> {
  viewRef: ?React.ElementRef<View> = null;
  state: State = {
    blurRef: null,
  };

  handleLoadEnd = () => {
    if (this.viewRef) {
      const nodeHandle = findNodeHandle(this.viewRef);
      this.setState({
        blurRef: nodeHandle,
      });
      console.log('got it', nodeHandle);
    }
  }

  render() : React.Node {
    return (
      <View style={{ flex: 1 }}>
        <View ref={ref => {this.viewRef = ref; }} style={[absolute, { flex: 1}]}>
          <View style={[absolute, backgroundView]}>
            <Image source={testImage} onLoadEnd={this.handleLoadEnd} style={[absolute, imageStyle]} />
          </View>
          <View style={[absolute, {zIndex: 3 }]}>
            <PlaylistEntry
              index={1}
              duration={330}
              title="Artist - Title"
            />
            <PlaylistEntry
              index={1}
              duration={330}
              title="Artist - Title"
            />
            <PlaylistEntry
              index={1}
              duration={330}
              title="Artist - Title"
            />
          </View>
        </View>
        {this.state.blurRef && (<BlurView
          style={[absolute, { zIndex: 10, top: 30 }]}
          viewRef={this.state.blurRef}
          blurType="light"
          blurAmount={10}
        />)}
      </View>
    );
  }
}

storiesOf('New Components', module)
  .add('Image test', () => <TestComponent />)
  .add('Image test 2', () => <Menu />)