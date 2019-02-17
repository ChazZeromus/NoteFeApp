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
  containerStyle?: StyleSheet,
};
type State = {
  showView: boolean,
};

export class FadeBlur extends React.Component<Props, State> {
  static contextType = Types.FadeBlurContext;
  opacityFade = new Animated.Value(0);
  state: State = {
    showView: false,
  }

  componentDidMount() {
    this.opacityFade.addListener(this.handleObserveFade.bind(this));
  }

  componentDidUpdate(prevProps: Props) {
    const { visible } = this.props;

    if (visible !== prevProps.visible) {
      Animated.timing(this.opacityFade, {
        toValue: visible ? 1 : 0,
        duration: visible ? 450 : 250,
        useNativeDriver: true,
      }).start();
    }
  }

  componentWillUnmount() {
    this.opacityFade.removeAllListeners();
  }

  handleObserveFade(current: {value: number}) {
    const { value: currentFade } = current;
    const shouldShow = currentFade > 0.0;
    if (shouldShow !== this.state.showView) {
      this.setState({ showView: shouldShow });
      // TODO: Hack to fix issue with animations not triggering listeners if a component that already
      // was mounted and used those animations were unmounted. See Animation listener bug in storybook
      // for more info.
      if (!shouldShow) {
        this.opacityFade.removeAllListeners();
        this.opacityFade.addListener(this.handleObserveFade.bind(this));
      }
    }
  }

  render() : React.Node {
    const blurHandle: ?Types.BlurHandle = this.context;

    if (!this.state.showView) {
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
      <Animated.View
        style={[
          styles.container,
          this.props.containerStyle,
          { opacity: this.opacityFade }
        ]}
      >
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