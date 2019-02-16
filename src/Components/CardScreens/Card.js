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
}

type State = {};

export default class Card extends React.Component<Props, State> {
  static defaultProps = {
    restrictedPullDistance: 10,
  };

  state: State = {};

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
      onPanResponderGrant: this.handlePanGrant.bind(this),
      onPanResponderMove: this.handlePanMove.bind(this),
      onPanResponderRelease: this.handlePanRelease.bind(this),
    });
  }

  handlePanGrant(evt: any, gestureState: any) {
    this.transOffset = this.lastTransValue;
    this.sides = this.props.getSides();
  }

  handlePanMove(evt: any, gestureState: any) {
    const swipeOffset = this.transOffset + gestureState.dx;
    this.animate(this._calculateAnimation(
      swipeOffset,
      this._shouldRestrict(swipeOffset),
    ));

    console.log(this.sides);

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
  
  handlePanRelease(evt: any, gestureState: any) {
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

  componentDidMount() {
    this.animTrans.addListener(({value}) => {
      this.lastTransValue = value;
    });
  }

  componentWillUnmount() {
    this.animTrans.removeAllListeners();
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
      rotate: rightProgress * 0.99,
      scale: 1.0 - (rightProgressAbs * 0.3),
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

  panBaseView: types.PanBaseView = (props: types.PanBaseViewProps) => {
    return (
      <View style={styles.panBaseContainer} {...this.responder.panHandlers}>
        {props.children}
      </View>
    );
  };

  render() : React.Node {
    const Screen = this.props.screen;
    const interpRotate = this.animRotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '90deg'],
    });

    return (
      <Animated.View
        style={[styles.cardStyle, {
          transform: [
            {perspective: 1000 },
            {translateX: this.animTrans},
            {rotateY: interpRotate},
            {scale: this.animScale},
          ]
        }]}
      >
        <Button title="YEET" onPress={this.handlePress} />
        <Screen
          PanBaseView={this.panBaseView}
          isReady={true}
        />
      </Animated.View>
    )
  }
}
