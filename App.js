import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Switch } from 'react-native';

export default function App() {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  return (
    <View style={styles.main}>
      <Text style={styles.text}>Open up App.js to start working on your app!</Text>
      <Switch
        trackColor={{ false: '#f00', true: '#0f0' }}
        thumbColor={isEnabled ? '#009900' : '#990000'}
        onChange={toggleSwitch}
        value={isEnabled}
      />
      <StatusBar style="default" backgroundColor="#69f" />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#0ff'
  }
});

//https://docs.nativebase.io/install-expo

//import React from "react";
//import { NativeBaseProvider, Box } from "native-base";
//
//export default function App() {
//  return (
//    <NativeBaseProvider>
//      <Box>Hello world</Box>
//    </NativeBaseProvider>
//  );
//}