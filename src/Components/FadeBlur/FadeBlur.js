// @flow
import * as React from 'react';
import { View, Animated, StyleSheet, Platform } from 'react-native';
import { BlurView, VibrancyView } from 'react-native-blur';

import * as Types from './types';
import styles from './styles';

type Props = {
  children?: React.Node,
  contentStyle?: StyleSheet,
  visible: boolean,
  preferVibrancy?: boolean,
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
        duration: visible ? 400 : 250,
      }).start();
    }
  }

  componentWillUnmount() {
    this.state.opacityFade.removeAllListeners();
  }

  handleObserveFade(current: {value: number}) {
    const { value: currentFade } = current;
    const shouldShow = currentFade > 0.0;
    if (shouldShow !== this.state.renderBlur) {
      this.setState({ renderBlur: shouldShow });
    }
  }

  render() : React.Node {
    const blurHandle: ?Types.BlurHandle = this.context;

    if (!this.state.renderBlur) {
      return null;
    }

    const BlurComponent = (
      this.props.preferVibrancy
      && Platform.OS === 'ios'
    ) ? VibrancyView
    : BlurView;

    if (BlurComponent === BlurView && !blurHandle) {
      return null;
    }

    return (
      <Animated.View style={[styles.container, { opacity: this.state.opacityFade }]}>
        {blurHandle && (
          <BlurComponent
            style={styles.blur}
            blurRadius={20} 
            blurType="dark"
            downsampleFactor={6}
            viewRef={blurHandle}
          />
        )}
        <View style={[styles.innerContent, this.props.contentStyle]}>
          {this.props.children}
        </View>
      </Animated.View>
    );
  }
}