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
  AsyncStorage,
  WebView,
  View
} from 'react-native';
import { Button } from 'antd-mobile';
import { Provider } from "react-redux";
import { persistStore } from 'redux-persist-immutable';

import { MemoryRouter as Router, Route, Switch} from 'react-router-dom';
import configureStore from "./_service/reduxstore/configureStore";

import LoginForm from './rn_containers/login/index';



const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

//redux store
const store = configureStore();
const redux_store_config  = {
  storage: AsyncStorage,
  blacklist:['data'],
  whitelist:['auth','app']
}
persistStore(store,redux_store_config);

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <Provider store={store}>
      <Router>
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to Peentos Mobile System
        </Text>
        <Text style={styles.instructions}>
          We smart, We deserved.
        </Text>
        
        <LoginForm/>

      </View>
      </Router>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
