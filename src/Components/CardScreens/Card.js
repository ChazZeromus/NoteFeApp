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
  rotate: number,
  hingeSide: number,
};

type Props = {
  screen: types.ScreenComponentType,
  viewWidth: number,
  getSides: () => CardSides,
  onRest: () => void,
  routeId: string,
  allowTouch: boolean,
  hidden: boolean,
  restrictedPull: number,
  foldCutoff: number,
  animationDuration: number,
}

type State = {
  isFocused: boolean,
};

export default class Card extends React.Component<Props, State> {
  static defaultProps = {
    // Ratio of view width that we max-out on when there are no cards
    restrictedPull: 0.2,
    // Ratio of view were the fold completes automatically
    foldCutoff: 0.5,
    // Duration of flip animation in ms
    animationDuration: 150,
  };

  state: State = {
    // Whether current card is in focus and not animating
    isFocused: false,
  };

  // Which side of the screen should the card hinge as it animates. Left (-1) or right (1)
  hingeSide: number = 0;
  // Animation values for pre and post rotation based on which hinge is specified
  preRotateTranslate = new Animated.Value(0);
  postRotateTranslate = new Animated.Value(0);
  // Animation value of card rotation for animation
  animRotate = new Animated.Value(0);

  // Animation event func for rotation
  _animateEvent = Animated.event([{
    rotate: this.animRotate,
  }]);

  // Pan responder handler
  responder: PanResponder;

  // Keep track of swipe offset in case user touches a card mid-animation
  lastSwipeOffset: number = 0;
  // Current offset to use based off of lastSwipeOffset to offset when panning starts
  swipeOffset: number = 0;

  // References to card components adjacent this card in order to animate them in
  sides: CardSides = {
    leftRef: null,
    rightRef: null,
  };

  constructor(props: Props) {
    super(props);

    this._updateTranslations(-1);
    this.responder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder.bind(this),
      onPanResponderGrant: this._handlePanGrant.bind(this),
      onPanResponderMove: this._handlePanMove.bind(this),
      onPanResponderRelease: this._handlePanRelease.bind(this),
    });
  }

  componentDidMount() {
    this.animRotate.addListener(({value}) => {
      this.updateFocus(value);
    });
  }

  componentWillUnmount() {
    this.animRotate.removeAllListeners();
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) : boolean {
    // Compare only scalar values
    const { screen, getSides, onRest, ...otherProps } = nextProps;
    const { screen: myScreen, getSides: mySides, onRest: myRest, ...myProps } = this.props;

    const otherJSON = JSON.stringify(otherProps);
    const myJSON = JSON.stringify(myProps);

    return otherJSON !== myJSON || this.state.isFocused !== nextState.isFocused;
  }

  updateFocus(rotateValue: number) {
    if (rotateValue === 0 && !this.state.isFocused) {
      this.lastSwipeOffset = 0;
      this.setState({ isFocused: true });
      this.props.onRest();
    }
    else if (rotateValue !== 0 && this.state.isFocused) {
      this.setState({ isFocused: false });
    }

    this.lastSwipeOffset = this.props.viewWidth * -rotateValue;
  }

  _updateTranslations(side: number) {
    const { viewWidth } = this.props;
    this.hingeSide = side;
    this.preRotateTranslate.setValue(side * viewWidth / 2);
    this.postRotateTranslate.setValue(-side * viewWidth / 2);
  }
  
  _handleStartShouldSetPanResponder(evt: any, gestureState: any) : boolean {
    return this.props.allowTouch;
  }

  _handlePanGrant(evt: any, gestureState: any) {
    this.swipeOffset = this.lastSwipeOffset;
    this.sides = this.props.getSides();

    this._handlePanMove(evt, gestureState);
  }

  _handlePanMove(evt: any, gestureState: any) {
    const swipeOffset = this.swipeOffset + gestureState.dx;
    this.lastSwipeOffset = swipeOffset;

    this.animate(this._calculateAnimation(
      swipeOffset,
      this._shouldRestrict(swipeOffset),
    ));
    this._updateSideCardAnimations(swipeOffset);
  }
  
  _handlePanRelease(evt: any, gestureState: any) {
    const swipeOffset = this.swipeOffset + gestureState.dx;
    this.lastSwipeOffset = swipeOffset;

    const foldRightCutOff = this.props.viewWidth * this.props.foldCutoff;
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

  animate(offsets: AnimOffsets) {
    const { routeId } = this.props;
    this._animateEvent(offsets);
    this._updateTranslations(offsets.hingeSide);
  }

  _updateSideCardAnimations(swipeOffset: number) {
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

  _stopAnimation() {
    this.animRotate.stopAnimation();
    const { leftRef, rightRef } = this.sides;
    if (leftRef) { leftRef.animRotate.stopAnimation(); }
    if (rightRef) { rightRef.animRotate.stopAnimation(); }
  }

  _calculateAnimation(swipeOffset: number, restrict: boolean = false) : AnimOffsets {
    // Card offset from left side of screen
    // Progress of card's position across width
    const rightProgress = swipeOffset / this.props.viewWidth;
    const rotateProgress = -rightProgress;
    const hingeSide = Math.sign(rightProgress);

    if (restrict) {
      return {
        rotate: rotateProgress * this.props.restrictedPull,
        hingeSide,
      };
    }

    return {
      rotate: rotateProgress,
      hingeSide,
    };
  }

  doFold(scale: number) {
    const clippedScale = Math.max(Math.min(1, scale), -1);
    const duration = this.props.animationDuration;
    const anim = this._calculateAnimation(this.props.viewWidth * clippedScale);

    Animated.timing(this.animRotate, {
      toValue: anim.rotate,
      useNativeDriver: true,
      duration,
    }).start();
  }

  render() : React.Node {
    const Screen = this.props.screen;
    const interpRotate = this.animRotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-90deg'],
    });

    return (
      <Animated.View
        style={[
          styles.cardStyle,
          {
            transform: [
              // TODO: Perform a translation before rotate and one after
              // so rotation "hinges" on a particular side of the screen
              // for a more realistic cube effect.
              // Also maybe only cube the effect for non-current cards
              {perspective: 5000 },
              {translateX: this.preRotateTranslate },
              {rotateY: interpRotate},
              {translateX: this.postRotateTranslate },
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
