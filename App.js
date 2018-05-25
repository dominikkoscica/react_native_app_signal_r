/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button
} from 'react-native';
import { encode } from 'punycode';

var signalr = require('@aspnet/signalr');
var clients = require('./client');

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = { 
      text: 'Input Message to send',
      resultText: '',
      token: '',
      client: undefined
    }
  }
  
  onPressSend = () => {
    this.state.client.echo(this.state.text);
  }
  

  async componentDidMount() {
    
    var host = 'https://wc-signalr-hub.azurewebsites.net'

    var clientId = '123-456-789-0001-console';
    
    var client = await clients.createClient(host, clientId)
      .then(cli => {
         cli.connect()
          .then(() => {
            console.log('client', clientId, 'connected');
            cli.on('echo', message => {
              console.log('echo', message);
              this.setState({
                resultText: message
              })
            });
          });
          return cli
      })
      .catch(err => {
        console.log('error', err);
      });
      console.log(client);
      this.setState({
        client
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Input message!
        </Text>
        <TextInput 
          style={{ height: 200, width: '100%', borderColor: 'grey', borderWidth: 1 }}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text} />
        <Button 
          onPress={this.onPressSend} 
          title="SEND"
          color="blue" />
        <Text style={styles.instructions}>
          Received message!
        </Text>
        <Text style={styles.instructions}>
          {this.state.resultText}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    margin: 20
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
