// @flow
import * as React from 'react';
import { View } from 'react-native';

import * as utils from './utils';
import * as types from './types';

import RadialContext from './context';

type Props = {};
type State = {};

export default class RadialMenu extends React.Component<Props, State> {
  static contextType = RadialContext;

  get contextData() : types.RadialContextData {
    if (!this.context) {
      throw new Error('Radial Menu not rendered inside a RadialPanResonder');
    }

    return this.context;
  }

  componentDidMount() {
    this.contextData.menuRef = this;
  }

  render() : React.Node {
    return null;
  }
}