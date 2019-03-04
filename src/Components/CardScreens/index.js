// @flow
import * as React from 'react';
import { View, Button, Animated, PanResponder } from 'react-native';

import Card from './Card';
import type { CardSides } from './Card';

import styles from './styles';
import * as types from './types';

import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

function createCompareFunc<T>(...funcs: Array<T => number>): (T, T) => number {
  return (a: T, b: T) => {
    for (const orderFunc of funcs) {
      const aValue = orderFunc(a);
      const bValue = orderFunc(b);

      if (aValue !== bValue) {
        return aValue - bValue;
      }
    }

    return 0;
  }
}

type Props = {
  routes: types.CardScreenRoutes,
  initialRoute: string,
};

type State = {
  currentRoute: ?string,
  viewWidth: ?number,
  cardDrawOrder: types.CardScreenRoutes,
  sideLeft: ?string,
  sideRight: ?string,
  visibleRoutes: Array<string>,
};

type CardRef = React.ElementRef<typeof Card> | null;

export default class CardScreens extends React.Component<Props, State> {
  state: State = {
    currentRoute: null,
    viewWidth: null,
    cardDrawOrder: [],
    sideLeft: null,
    sideRight: null,
    visibleRoutes: [],
  };

  refMap: Map<string, CardRef> = new Map();
  refFuncMap: Map<string, CardRef => void> = new Map();
  forceFirstRoute: ?string;

  componentDidMount() {
    const { initialRoute } = this.props;
    this.setState({ currentRoute: initialRoute, visibleRoutes: [ initialRoute ] });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const prevIds: Array<string> = prevProps.routes.map(({ id }) => id).sort();
    const currentIds: Array<string> = this.props.routes.map(({ id }) => id).sort();

    const shouldUpdate = JSON.stringify(prevIds) !== JSON.stringify(currentIds)
      || prevState.currentRoute !== this.state.currentRoute
      || prevState.sideLeft !== this.state.sideLeft
      || prevState.sideRight !== this.state.sideRight;

    if (shouldUpdate) {
      this.updateCardDrawOrder();
    }
  }

  // Generate a single function for each route
  _getUpdateRefFunc(route: string) : CardRef => void {
    let func = this.refFuncMap.get(route);

    if (!func) {
      func = ref => this.handleUpdateRef(route, ref);
      this.refFuncMap.set(route, func);
    }

    return func;
  }

  handleUpdateRef(route: string, ref: ?React.ElementRef<typeof Card>) {
    // console.log('set ref', route, ref);
    if (ref) {
      this.refMap.set(route, ref);
      if (route === this.state.currentRoute) {
        ref.updateFocus(0);
      }
    } else {
      this.refMap.delete(route);
      this.refFuncMap.delete(route);
    }
  }

  updateCardDrawOrder() {
    const { routes } = this.props;
    const { currentRoute, sideLeft, sideRight } = this.state;
    const cardDrawOrder = [ ...routes ];

    // Make sure current and siblings are sorted last
    const compareFunc = createCompareFunc<types.CardRoute>(
      r => r.id === sideRight ? 1 : 0,
      r => r.id === currentRoute ? 1 : 0,
      r => r.id === sideLeft ? 1 : 0,
      r => routes.indexOf(r),
    );

    cardDrawOrder.sort(compareFunc);

    this.setState({ cardDrawOrder });
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

    const sideLeft = leftRoute ? leftRoute.id : null;
    const sideRight = rightRoute ? rightRoute.id : null;
    const visibleRoutes: Array<string> = [];

    if (this.state.currentRoute) { visibleRoutes.push(this.state.currentRoute); }
    if (sideLeft) { visibleRoutes.push(sideLeft); };
    if (sideRight) { visibleRoutes.push(sideRight); };

    this.setState({
      sideLeft,
      sideRight,
      visibleRoutes,
    });

    return cardSides;
  }

  handleCardRest(route: string) {
    this.setState({ currentRoute: route });
  }

  handleLayout = (e: any) => {
    this.setState({ viewWidth: e.nativeEvent.layout.width });
  }

  render() : React.Node {
    const { viewWidth, currentRoute } = this.state;
    return (
      <View
        style={styles.cardScreensContainer}
        onLayout={this.handleLayout}
      >
        {
          viewWidth
          ? this.state.cardDrawOrder.map(({id, screen}) => (
            <Card
              key={id}
              routeId={id}
              onRest={() => this.handleCardRest(id)}
              ref={this._getUpdateRefFunc(id)}
              getSides={() => this.handleGetSides(id)}
              viewWidth={viewWidth}
              screen={screen}
              allowTouch={id === this.state.currentRoute}
              hidden={!this.state.visibleRoutes.includes(id)}
            />
          ))
          : null
        }
      </View>
    );
  }
}