// @flow
import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { BlurView } from 'react-native-blur';

import * as Types from './types';
import styles from './styles';

type Props = {
  children?: React.Node,
  contentStyle?: StyleSheet,
  visible: boolean,
};
type State = {
  opacityFade: Animated.Value,
  renderBlur: boolean,
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export class FadeBlur extends React.Component<Props, State> {
  static contextType = Types.FadeBlurContext;
  state: State = {
    opacityFade: new Animated.Value(0),
    renderBlur: false,
  }

  componentDidMount() {
    this.state.opacityFade.addListener(this.handleObserveFade.bind(this));
  }

  componentDidUpdate(prevProps: Props) {
    const { visible } = this.props;
    if (visible !== prevProps.visible) {
      Animated.timing(this.state.opacityFade, {
        toValue: visible ? 1 : 0,
        duration: 250
      }).start();
    }
  }

  componentWillUnmount() {
    this.state.opacityFade.removeAllListeners();
  }

  handleObserveFade(current: {value: number}) {
    const { value: currentFade } = current;
    console.log(current);
    const shouldShow = currentFade > 0.0;
    if (shouldShow !== this.state.renderBlur) {
      console.log('shoulding', shouldShow);
      this.setState({ renderBlur: shouldShow });
    }
  }

  render() : React.Node {
    const blurHandle: ?Types.BlurHandle = this.context;

    if (!this.state.renderBlur) {
      return null;
    }

    return (
      <Animated.View style={[styles.container, { opacity: this.state.opacityFade }]}>
        {blurHandle && (
          <BlurView
            style={styles.blur}
            viewRef={blurHandle}
            blurRadius={25} 
            blurType="dark"
            downsampleFactor={6}
          />
        )}
        <View style={[styles.innerContent, this.props.contentStyle]}>
          {this.props.children}
        </View>
      </Animated.View>
    );
  }
}