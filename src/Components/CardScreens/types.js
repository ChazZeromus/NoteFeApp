// @flow
import * as React from 'react';

export type PanBaseViewProps = {
  children?: React.Node,
};

export type PanBaseView = React.ComponentType<PanBaseViewProps>;

export type ScreenProps = {
  routeId: string,
  panHandlers: Object,
  isReady: boolean,
};

export type ScreenComponentType = React.ComponentType<ScreenProps>;

export type CardRoute = {
  id: string,
  screen: ScreenComponentType,
};

export type CardScreenRoutes = Array<CardRoute>;