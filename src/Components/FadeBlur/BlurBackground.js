// @flow
import * as React from 'react';
import { View, findNodeHandle, StyleSheet } from 'react-native';

import * as Types from './types';

const backgroundStyleProp = StyleSheet.create({
  style: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0, right: 0,
    zIndex: 0,
    backgroundColor: '#eee',
  }
});

type State = {
  blurHandle: ?Types.BlurHandle,
};
type RenderProps = {
  ref: (?React.ElementRef<typeof View>) => void,
  style: StyleSheet,
}
type Props = {
  children: RenderProps => React.Node,
}
export class BlurBackground extends React.Component<Props, State> {
  state: State = {
    blurHandle: null,
  };
  _viewRef: ?React.ElementRef<typeof View> = null;

  handleSetViewRef = (ref: ?React.ElementRef<typeof View>) => {
    if (ref) {
      this._viewRef = ref;
      const handle = findNodeHandle(ref);
      console.log('handle', handle);
      this.setState({ blurHandle: handle });
    } else {
      this._viewRef = null;
      this.setState({ blurHandle: null });
    }
  }

  render() : React.Node {
    return (
      <Types.FadeBlurProvider value={this.state.blurHandle}>
        {this.props.children({ ref: this.handleSetViewRef, style: backgroundStyleProp.style })}
      </Types.FadeBlurProvider>
    );
  }
}