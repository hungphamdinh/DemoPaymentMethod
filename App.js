/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView} from 'react-native';
import Momo from './src/Momo';
import Zalo from './src/Zalo';
const App = () => {
  return (
    <SafeAreaView>
      <Momo />
      {/* <Zalo /> */}
    </SafeAreaView>
  );
};

export default App;
