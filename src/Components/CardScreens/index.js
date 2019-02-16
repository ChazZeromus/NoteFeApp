// @flow
import * as React from 'react';
import { View, Button, Animated, PanResponder } from 'react-native';

import Card from './Card';
import type { CardSides } from './Card';

import styles from './styles';
import * as types from './types';

import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

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

  refMap: Map<string, React.ElementRef<typeof Card>> = new Map();

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

  handleUpdateRef(route: string, ref: ?React.ElementRef<typeof Card>) {
    if (ref) {
      this.refMap.set(route, ref);
    } else {
      this.refMap.delete(route);
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

  handleGetSides(current: string) : CardSides {
    const count = this.props.routes.length;
    const currentIndex = this.props.routes.findIndex(s => s.id === current);
    return {
      leftRef: currentIndex > 0 ? this.refMap.get(this.props.routes[currentIndex - 1].id) : null,
      rightRef: currentIndex < count - 1 ? this.refMap.get(this.props.routes[currentIndex + 1].id) : null,
    };
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
        ? this.state.cardList.map(({id, screen}) => (
          <Card
            ref={ref => this.handleUpdateRef(id, ref)}
            getSides={() => this.handleGetSides(id)}
            viewWidth={viewWidth}
            screen={screen}
            key={id}
          />
        ))
        : null
      }
      </View>
    );
  }
}