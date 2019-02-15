// @flow
import * as React from 'react';
import { View, Button, Animated, PanResponder } from 'react-native';

import styles from './styles';
import * as types from './types';

type CardProps = {
  screen: types.ScreenComponentType,
  viewWidth: number,
}

type CardState = {
  rotated: boolean,
}

import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

class Card extends React.Component<CardProps, CardState> {
  state: CardState = {
    rotated: false,
  };

  animRotate = new Animated.Value(0);
  animTrans = new Animated.Value(0);
  animScale = new Animated.Value(1);

  responder: PanResponder;

  lastTransValue: number = 0;
  transOffset: number = 0;

  componentDidMount() {
    this.animTrans.addListener(({value}) => {
      this.lastTransValue = value;
      console.log(value);
    });
  }

  componentWillUnmount() {
    this.animTrans.removeAllListeners();
  }

  constructor() {
    super();
    this.responder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.transOffset = this.lastTransValue;
      },
      onPanResponderMove: (evt, gestureState) => {
        Animated.event([{ dx: this.animTrans }])({
          dx: this.transOffset + gestureState.dx
        });
      },
    });
  }

  handlePress = () => {
    const isRotated = !this.state.rotated;
    this.setState({
      rotated: isRotated,
    });
    Animated.parallel([
      Animated.timing(this.animRotate, {
        toValue: isRotated ? 0.99 : 0,
        useNativeDriver: true,
        duration: 1000,
      }),
      Animated.timing(this.animTrans, {
        toValue: isRotated ? this.props.viewWidth : 0,
        useNativeDriver: true,
        duration: 1000,
      }),
      Animated.timing(this.animScale, {
        toValue: isRotated ? 0.7 : 1,
        useNativeDriver: true,
        duration: 1000,
      })
    ]).start();
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
            {translateX: this.animTrans},
            {rotateY: interpRotate},
            {scale: this.animScale},
          ]
        }]}
      >
        <Button title="Do it" onPress={this.handlePress} />
        <Screen
          PanBaseView={this.panBaseView}
          isReady={true}
        />
      </Animated.View>
    )
  }
}

type Props = {
  routes: types.CardScreenRoutes,
  initialRoute: string,
};

type State = {
  currentRoute: ?string,
  viewWidth: ?number,
  cardList: types.CardScreenRoutes,
};

export default class CardScreens extends React.Component<Props, State> {
  state: State = {
    currentRoute: null,
    viewWidth: null,
    cardList: [],
  };

  componentDidMount() {
    this.setState({ currentRoute: this.props.initialRoute });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const prevIds: Array<string> = prevProps.routes.map(({ id }) => id).sort();
    const currentIds: Array<string> = this.props.routes.map(({ id }) => id).sort();

    const shouldUpdate = JSON.stringify(prevIds) !== JSON.stringify(currentIds)
      || prevState.currentRoute !== this.state.currentRoute;

    if (shouldUpdate) {
      this.updateCardList();
    }
  }

  updateCardList() {
    const { routes } = this.props;
    const { currentRoute } = this.state;
    const cardList = [...routes];

    cardList.sort((a, b) => {
      const isCurrentA = a.id === currentRoute ? 1 : 0;
      const isCurrentB = b.id === currentRoute ? 1 : 0;

      if (isCurrentA !== isCurrentB) {
        return isCurrentA - isCurrentB;
      }

      return routes.indexOf(a) - routes.indexOf(b);
    });
    this.setState({ cardList });
  }

  render() : React.Node {
    const { viewWidth } = this.state;
    return (
      <View
        style={styles.cardScreensContainer}
        onLayout={({ nativeEvent }) => { this.setState({ viewWidth: nativeEvent.layout.width }) }}
      >
      {
        viewWidth
        ? this.state.cardList.map(({id, screen}) => <Card viewWidth={viewWidth} screen={screen} key={id} />)
        : null
      }
      </View>
    );
  }
}