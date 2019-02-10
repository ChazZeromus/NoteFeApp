// @flow
import * as React from 'react';
import { View, findNodeHandle, StyleSheet } from 'react-native';

import * as Types from './types';

const backgroundStyleProp = StyleSheet.create({
  style: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0, right: 0,
    zIndex: 0,
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
  children: (typeof View, RenderProps) => React.Node,
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
      this.setState({ blurHandle: handle });
    } else {
      this._viewRef = null;
      this.setState({ blurHandle: null });
    }
  }

  wrappedView = (props: *) => {
    let style: Array<Object> = [
      backgroundStyleProp.style,
      ...(Array.isArray(props.style) ? props.style : [props.style])
    ];

    const copyProps = {
      ...props,
      style,
      ref: this.handleSetViewRef,
    };

    return <View {...copyProps} />;
  }

  render() : React.Node {
    return (
      <Types.FadeBlurProvider value={this.state.blurHandle}>
        {this.props.children(
          this.wrappedView,
          {
            ref: this.handleSetViewRef,
            style: backgroundStyleProp.style
          },
        )}
      </Types.FadeBlurProvider>
    );
  }
}