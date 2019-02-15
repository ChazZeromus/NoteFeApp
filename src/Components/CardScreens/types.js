// @flow
import * as React from 'react';

export type PanBaseViewProps = {
  children?: React.Node,
};

export type PanBaseView = React.ComponentType<PanBaseViewProps>;

export type ScreenProps = {
  PanBaseView: PanBaseView,
  isReady: boolean,
};

export type ScreenComponentType = React.ComponentType<ScreenProps>;

export type CardScreenRoutes = Array<{
    id: string,
    screen: ScreenComponentType,
}>;