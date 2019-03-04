// @flow
import * as React from 'react';
import { Button, Text, Image, View, StyleSheet, Animated } from 'react-native';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import Svg, { Defs, Pattern, Rect, Path } from 'react-native-svg';

const SvgGrid = () => (
  <Svg width="100%" height="100%">
    <Defs>
      <Pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
        <Path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" stroke-width="0.5"/>
      </Pattern>
      <Pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
        <Rect width="80" height="80" fill="url(#smallGrid)"/>
        <Path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1"/>
      </Pattern>
    </Defs>

    <Rect width="100%" height="100%" fill="url(#grid)" />
  </Svg>
)

const styles = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: 100,
  height: 100,
  opacity: 0.7,
}

const Face = (props: { style?: any }) => (
  <Animated.View style={[styles, props.style]}>
    <SvgGrid />
    <Text style={{ position: 'absolute', left: 0, top: 0 }}>1</Text>
    <Text style={{ position: 'absolute', right: 0, top: 0 }}>2</Text>
    <Text style={{ position: 'absolute', right: 0, bottom: 0 }}>3</Text>
    <Text style={{ position: 'absolute', left: 0, bottom: 0 }}>4</Text>
  </Animated.View>
)

class ThreeDTest extends React.Component<{}> {
  render() : React.Node {
    return (
        <View>
          <View
            style={{
              position: 'absolute',
              backgroundColor: '#afa',
              left: 0,
              top: 0,
              width: 100,
              height: 100,
              zIndex: 2,
            }}
          >
            <Text>1</Text>
          </View>
          <View
            style={{
              position: 'absolute',
              backgroundColor: '#aaf',
              left: 50,
              top: 50,
              width: 100,
              height: 100,
              zIndex: 1,
            }}
          >
            <Text>2</Text>
          </View>
          <View
            style={{
              position: 'absolute',
              backgroundColor: '#faa',
              left: 100,
              top: 100,
              width: 100,
              height: 100,
              zIndex: 0,
            }}
          >
            <Text>3</Text>
          </View>
        </View>
    );
  }
};

type TileProps = {
  children?: React.Node,
  cheese?: any,
  style?: any,
}

class Tile extends React.PureComponent<TileProps> {
  componentDidMount() {
    console.log('Tile mount!');
  }
  render() {
    console.log('Tile render');
    return (
      <View style={this.props.style}>
        {this.props.children}
        <Text>Cheese {JSON.stringify(this.props.cheese)}</Text>
      </View>
    )
  }
}

const simpleStyle = {
  width: 100,
  height: 100,
  position: 'absolute',
}

type SimpleState = {
  a: number,
  items: Array<number>,
  prefix: string,
}

class Simple extends React.Component<{}, SimpleState> {
  static _id = 0;
  myId = ++Simple._id;

  state: SimpleState = {
    a: 1,
    items: [0, 1],
    prefix: '',
  }

  handleSetRef = (ref, which) => {
    console.log('set ref', which, ref, 'on', this.myId);
  }

  handleSetRefs = [
    ref => this.handleSetRef(ref, 0),
    ref => this.handleSetRef(ref, 1),
  ]

  elementStyles = [
    [simpleStyle, { position: 'absolute', left: 0, top: 0, backgroundColor: '#aaf', }],
    [simpleStyle, { position: 'absolute', left: 50, top: 0, backgroundColor: '#faa', }],
  ]

  handlePress = () => {
    console.log('pressed')
    // this.setState({ a: this.state.a + 1, prefix: `${this.state.a + 1}` });
    this.setState({ a: this.state.a + 1, items: this.state.a % 2 === 0 ? [0, 1] : [1, 0] });
    // this.setState({ a: this.state.a + 1 });
  }

  render() : React.Node {
    return (
      <>
        {this.state.items.map((i) => (
          <Tile
            key={`${i}${this.state.prefix}`}
            style={this.elementStyles[i]}
            ref={this.handleSetRefs[i]}
            cheese={1}
          >
          </Tile>
        ))}
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} >
          <Text>This proves that ref callbacks that change (inline) will cause previous old
          callbacks to be called with ref set to null</Text>
          <Button title="yo" onPress={this.handlePress} />
        </View>
      </>
    );
  }
}

storiesOf('3D Test', module)
  .addDecorator(withKnobs)
  .add('Cube', () => <ThreeDTest />)
  .add('Draw re-order and one-time ref set', () => <Simple />)