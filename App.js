/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  AppState,
  Button,
  Platform,
  Text,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import RNMomosdk from 'react-native-momosdk';
const RNMomosdkModule = NativeModules.RNMomosdk;
const EventEmitter = new NativeEventEmitter(RNMomosdkModule);
import {Colors} from 'react-native/Libraries/NewAppScreen';
//MoMo
const merchantname = 'CGV Cinemas';
const merchantcode = 'CGV01';
const merchantNameLabel = 'Nhà cung cấp';
const billdescription = 'Fast and Furious 8';
const amount = 1000;
const enviroment = '1'; //"0": SANBOX , "1": PRODUCTION
class App extends React.Component {
  state = {
    data: '',
    appState: AppState.currentState,
  };
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    EventEmitter.addListener(
      'RCTMoMoNoficationCenterRequestTokenReceived',
      response => {
        try {
          console.log('<MoMoPay>Listen.Event::' + JSON.stringify(response));
          if (response && response.status == 0) {
            this.setState({
              data: response,
            });
            //SUCCESS: continue to submit momoToken,phonenumber to server
            let fromapp = response.fromapp; //ALWAYS:: fromapp==momotransfer
            let momoToken = response.data;
            let phonenumber = response.phonenumber;
            let message = response.message;
            let orderId = response.refOrderId;
          } else {
            let message = response.message;
            console.log(message);
            //Has Er ror: show message here
          }
        } catch (ex) {}
      },
    );
    //OPTIONAL
    EventEmitter.addListener(
      'RCTMoMoNoficationCenterRequestTokenState',
      response => {
        console.log('<MoMoPay>Listen.RequestTokenState:: ' + response.status);
        console.log(response);
        // status = 1: Parameters valid & ready to open MoMo app.
        // status = 2: canOpenURL failed for URL MoMo app
        // status = 3: Parameters invalid
      },
    );
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
    }
    console.log(nextAppState);
    this.setState({appState: nextAppState});
  };

  _onPressMoMo = async () => {
    console.log(this.state.data);
    let jsonData = {};
    jsonData.enviroment = enviroment; //SANBOX OR PRODUCTION
    jsonData.action = 'gettoken'; //DO NOT EDIT
    jsonData.merchantname = merchantname; //edit your merchantname here
    jsonData.merchantcode = merchantcode; //edit your merchantcode here
    jsonData.merchantnamelabel = merchantNameLabel;
    jsonData.description = billdescription;
    jsonData.amount = 1000; //order total amount
    jsonData.orderId = 'ID20181123192300';
    jsonData.orderLabel = 'Ma don hang';
    jsonData.appScheme = 'momocgv20170101'; // iOS App Only , match with Schemes Indentify from your  Info.plist > key URL types > URL Schemes
    // console.log('data_request_payment ' + JSON.stringify(jsonData));
    if (Platform.OS === 'android') {
      let dataPayment = await RNMomosdk.requestPayment(jsonData);
      this.momoHandleResponse(dataPayment);
    } else {
      RNMomosdk.requestPayment(jsonData);
    }
  };

  async momoHandleResponse(response) {
    try {
      if (response && response.status == 0) {
        //SUCCESS continue to submit momoToken,phonenumber to server
        let fromapp = response.fromapp; //ALWAYS:: fromapp == momotransfer
        let momoToken = response.data;
        let phonenumber = response.phonenumber;
        let message = response.message;
        console.log('Momo response')
        console.log(response);
      } else {
        //let message = response.message;
        //Has Error: show message here
      }
    } catch (ex) {}
  }
  render() {
    console.log(this.state.data);

    return (
      <SafeAreaView>
        <Button title="Hello" onPress={this._onPressMoMo} />
        <Text>{JSON.stringify(this.state.data)}</Text>
      </SafeAreaView>
    );
  }
}

export default App;
