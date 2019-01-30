// @flow
import * as React from 'react';
import { View, Text, Button } from 'react-native';
import Client, { Convo } from 'web-switch-client';

const styles = {
  container: {
    flex: 1
  },
};

const URL = 'ws://localhost:8765/somechannel/someroom';

type Props = {};
type State = {
  text: string,
};

export default class WebSwitchTest extends React.Component<Props, State> {
  state: State = {
    text: `Click to test ${URL}`,
  }

  async handlePress() {
    try {
      this.setState({ text: 'loading' });

      const client = new Client(
        URL,
        url => new WebSocket(url),
      );

      await client.convo('whoami', async (convo, guid) => {
          const data = await convo.sendAndExpect({action: 'whoami'});
          console.log('Reply:', data);
          this.setState({ text: `Data: ${JSON.stringify(data)}`});
      });

      await client.close();
    }
    catch (e) {
      console.warn('something happened:', e);
        this.setState({ text: `Something happened: ${JSON.stringify(e)}`});
    }
  }

  render() : React.Node {
    return (
      <View style={styles.container}>
        <Text>{this.state.text}</Text>
        <Button onPress={() => this.handlePress()} title="Test" />
      </View>
    );
  }
}