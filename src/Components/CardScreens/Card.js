// @flow
import * as React from 'react';
import { View, Button, Animated, PanResponder } from 'react-native';

import styles from './styles';
import * as types from './types';

export type CardSides = {
  leftRef: ?React.ElementRef<typeof Card>,
  rightRef: ?React.ElementRef<typeof Card>,
};

type AnimOffsets = {
  translate: number,
  rotate: number,
  scale: number
};

type Props = {
  screen: types.ScreenComponentType,
  viewWidth: number,
  getSides: () => CardSides,
  onRest: () => void,
  restrictedPullDistance: number,
  routeId: string,
  hidden?: boolean,
}

type State = {
  isFocused: boolean,
};

export default class Card extends React.Component<Props, State> {
  static defaultProps = {
    restrictedPullDistance: 10,
  };

  state: State = {
    isFocused: false,
  };

  animRotate = new Animated.Value(0);
  animTrans = new Animated.Value(0);
  animScale = new Animated.Value(1);

  responder: PanResponder;

  lastTransValue: number = 0;
  transOffset: number = 0;

  sides: CardSides = {
    leftRef: null,
    rightRef: null,
  };

  constructor() {
    super();
    
    this.responder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderGrant: this._handlePanGrant.bind(this),
      onPanResponderMove: this._handlePanMove.bind(this),
      onPanResponderRelease: this._handlePanRelease.bind(this),
    });
  }

  componentDidMount() {
    this.animTrans.addListener(({value}) => {
      this.lastTransValue = value;
      this.updateFocus();
    });
  }

  componentWillUnmount() {
    this.animTrans.removeAllListeners();
  }

  updateFocus() {
    const value = this.lastTransValue;

    if (value === 0 && !this.state.isFocused) {
      this.setState({ isFocused: true });
      this.props.onRest();
    }
    else if (value !== 0 && this.state.isFocused) {
      this.setState({ isFocused: false });
    }
  }

  _handlePanGrant(evt: any, gestureState: any) {
    this.transOffset = this.lastTransValue;
    this.sides = this.props.getSides();
  }

  _handlePanMove(evt: any, gestureState: any) {
    const swipeOffset = this.transOffset + gestureState.dx;
    this.animate(this._calculateAnimation(
      swipeOffset,
      this._shouldRestrict(swipeOffset),
    ));

    // Animate surrounding cards
    const { leftRef, rightRef } = this.sides;
    if (leftRef) {
      leftRef.animate(this._calculateAnimation(
        -this.props.viewWidth + swipeOffset
      ));
    }
    if (rightRef) {
      rightRef.animate(this._calculateAnimation(
        this.props.viewWidth + swipeOffset
      ));
    }
  }
  
  _handlePanRelease(evt: any, gestureState: any) {
    const swipeOffset = this.transOffset + gestureState.dx;
    const foldRightCutOff = this.props.viewWidth * 0.3;
    const restrict = this._shouldRestrict(swipeOffset);
    const { leftRef, rightRef } = this.sides;
    let foldDir = 0;

    if (!restrict && Math.abs(swipeOffset) > foldRightCutOff) {
      foldDir = swipeOffset > foldRightCutOff ? 1 : -1;
    }
    this.doFold(foldDir);

    this.sides = { leftRef: null, rightRef: null };

    if (rightRef) {
      rightRef.doFold(1 + foldDir);
    }
    if (leftRef) {
      leftRef.doFold(-1 + foldDir);
    }
  }

  _shouldRestrict(swipeOffset: number) : boolean {
    return (swipeOffset > 0 && this.sides.leftRef === null)
      || swipeOffset < 0 && this.sides.rightRef === null;
  }

  animate: (offsets: AnimOffsets) => void = Animated.event([{
    translate: this.animTrans,
    rotate: this.animRotate,
    scale: this.animScale,
  }]);

  _calculateAnimation(swipeOffset: number, restrict: boolean = false) : AnimOffsets {
    // Card offset from left side of screen
    // Progress of card's position across width
    const rightProgress = Math.min(swipeOffset / this.props.viewWidth, this.props.viewWidth);
    // Same as above but absolute if card goes left
    const rightProgressAbs = Math.min(Math.abs(swipeOffset) / this.props.viewWidth, this.props.viewWidth);

    if (restrict) {
      return {
        translate: rightProgress * this.props.restrictedPullDistance,
        rotate: 0,
        scale: 1,
      };
    }

    return {
      translate: swipeOffset,
      rotate: rightProgress,
      scale: 1.0 - (rightProgressAbs * 0.4),
    };
  }

  doFold(scale: number) {
    const clippedScale = Math.max(Math.min(1, scale), -1);
    const duration = 200;
    const anim = this._calculateAnimation(this.props.viewWidth * clippedScale);

    Animated.parallel([
      Animated.timing(this.animTrans, {
        toValue: anim.translate,
        useNativeDriver: true,
        duration,
      }),
      Animated.timing(this.animRotate, {
        toValue: anim.rotate,
        useNativeDriver: true,
        duration,
      }),
      Animated.timing(this.animScale, {
        toValue: anim.scale,
        useNativeDriver: true,
        duration,
      })
    ]).start();
  }

  handlePress = () => {
    this.doFold(1);
  }

  render() : React.Node {
    const Screen = this.props.screen;
    const interpRotate = this.animRotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '90deg'],
    });

    return (
      <Animated.View
        style={[
          styles.cardStyle,
          {
            transform: [
              {perspective: 1000 },
              {translateX: this.animTrans},
              {rotateY: interpRotate},
              {scale: this.animScale},
            ]
          },
          { opacity: this.props.hidden ? 0 : 1 }
        ]}
      >
        <Screen
          routeId={this.props.routeId}
          panHandlers={this.responder.panHandlers}
          isReady={this.state.isFocused}
        />
      </Animated.View>
    )
  }
}
