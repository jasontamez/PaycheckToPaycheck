import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider, Box, Switch } from "native-base";
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import configureStore from './store/store';
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {
	const [isEnabled, setIsEnabled] = useState(false);
	const toggleSwitch = () => setIsEnabled(previousState => !previousState);
	const {store, persistor} = configureStore();

	const loading = null;

	return (
		<Provider store={store}>
			<NativeBaseProvider>
				<PersistGate loading={loading} persistor={persistor}>
					<View style={styles.main}>
						<Box alignSelf="center" _text={{color: "#0ff"}}>Hellooooo world.</Box>
						<Switch
							onToggle={toggleSwitch}
							isChecked={isEnabled}
							offTrackColor="#900"
							onTrackColor="#090"
							onThumbColor="#0f0"
							offThumbColor="#f00"
						/>
						<StatusBar style="default" backgroundColor="#69f" />
						<Text style={styles.text}>{isEnabled ? "Enabled" : "Disabled"}</Text>
					</View>
				</PersistGate>
			</NativeBaseProvider>
		</Provider>
	);
};

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

export default App;
