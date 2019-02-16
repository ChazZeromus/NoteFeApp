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
  cardDepthList: types.CardScreenRoutes,
  currentSides: Array<string>,
};

export default class CardScreens extends React.Component<Props, State> {
  state: State = {
    currentRoute: null,
    viewWidth: null,
    cardDepthList: [],
    currentSides: [],
  };

  refMap: Map<string, React.ElementRef<typeof Card>> = new Map();

  componentDidMount() {
    this.setState({ currentRoute: this.props.initialRoute });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const prevIds: Array<string> = prevProps.routes.map(({ id }) => id).sort();
    const currentIds: Array<string> = this.props.routes.map(({ id }) => id).sort();

    const shouldUpdate = JSON.stringify(prevIds) !== JSON.stringify(currentIds)
      || prevState.currentRoute !== this.state.currentRoute
      || prevState.currentSides !== this.state.currentSides;

    if (shouldUpdate) {
      this.updateCardList();
    }
  }

  handleUpdateRef(route: string, ref: ?React.ElementRef<typeof Card>) {
    if (ref) {
      this.refMap.set(route, ref);
      if (route === this.state.currentRoute) {
        ref.updateFocus();
      }
    } else {
      this.refMap.delete(route);
    }
  }

  updateCardList() {
    const { routes } = this.props;
    const { currentRoute } = this.state;
    const cardDepthList = [ ...routes ];

    cardDepthList.sort((a, b) => {
      const isCurrentA = a.id === currentRoute ? 1 : 0;
      const isCurrentB = b.id === currentRoute ? 1 : 0;

      if (isCurrentA !== isCurrentB) {
        return isCurrentA - isCurrentB;
      }

      const { currentSides } = this.state;
      const isSideA = currentSides.includes(a.id) ? 1 : 0;
      const isSideB = currentSides.includes(b.id) ? 1 : 0;

      if (isSideA !== isSideB) {
        return isSideA - isSideB;
      }

      return routes.indexOf(a) - routes.indexOf(b);
    });

    this.setState({ cardDepthList });
  }

  handleGetSides(route: string) : CardSides {
    const count = this.props.routes.length;
    const currentIndex = this.props.routes.findIndex(s => s.id === route);
    const leftRoute = currentIndex > 0 ? this.props.routes[currentIndex - 1] : null;
    const rightRoute = currentIndex < count - 1 ? this.props.routes[currentIndex + 1] : null;

    const cardSides: CardSides = {
      leftRef: leftRoute ? this.refMap.get(leftRoute.id) : null,
      rightRef: rightRoute ? this.refMap.get(rightRoute.id) : null,
    };

    const newSideRoutes = [];

    if (leftRoute) { newSideRoutes.push(leftRoute.id); }
    if (rightRoute) { newSideRoutes.push(rightRoute.id); }

    this.setState({ currentSides: newSideRoutes });

    return cardSides;
  }

  handleCardRest(route: string) {
    this.setState({ currentRoute: route, currentSides: [] });
  }

  render() : React.Node {
    const { viewWidth } = this.state;
    const shownRoutes = [...this.state.currentSides, this.state.currentRoute];
    return (
      <View
        style={styles.cardScreensContainer}
        onLayout={({ nativeEvent }) => { this.setState({ viewWidth: nativeEvent.layout.width }) }}
      >
        {
          viewWidth
          ? this.state.cardDepthList.map(({id, screen}) => (
            <Card
              routeId={id}
              onRest={() => this.handleCardRest(id)}
              ref={ref => this.handleUpdateRef(id, ref)}
              getSides={() => this.handleGetSides(id)}
              viewWidth={viewWidth}
              screen={screen}
              key={id}
              hidden={!shownRoutes.includes(id)}
            />
          ))
          : null
        }
      </View>
    );
  }
}