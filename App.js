//import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider, VStack, HStack, Spinner, Heading, Container, Text } from "native-base";
import { Provider, useSelector } from 'react-redux';
import configureStore from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import getTheme from './components/theme';
//import Timeline from './components/timeline';
//import Calc from './components/calc';
import Menu from './components/menu';

const App = () => {
	const {store, persistor} = configureStore();
	const themeName = useSelector(state => state.theme);
	const theme = getTheme(themeName);

	const loading = (
		<VStack justifyContent={"center"}>
			<HStack space="md" justifyContent={"center"}>
				<Spinner accessibilityLabel="Loading info" color="secondary.500" />
				<Heading color="primary.500" fontSize="md">Loading...</Heading>
			</HStack>
		</VStack>
	);

	const DisplayTimeline = () => {
		const timeline = useSelector(state => state.timeline);
		if(timeline.length === 0) {
			return <Empty />;
		}
		// return <Timeline content={timeline} />;
		return <Text>Null Timeline</Text>;
	};

	const Empty = () => {
		const [bill, payday] = useSelector((state) => [state.aBill, state.aPaycheck]);
		return (
			<VStack bg="primary.500" alignContent={"center"}>
				<Center>
					<Text bold fontSize="lg">Add {bill} and/or {payday} to continue.</Text>
				</Center>
			</VStack>
		);
	};

	const Content = () => {
		const page = useSelector(state => state.page);
		switch (page) {
			case "timeline":
				return <DisplayTimeline />;
			//case "calc":
			//	return <Calc />;
		}
		return <Text>Null Content</Text>;
	};

	return (
		<Provider store={store}>
			<NativeBaseProvider theme={theme}>
				<PersistGate loading={loading} persistor={persistor}>
					<Container bg="bg">
						<VStack space="sm" justifyContent={"start"}>
							<Menu />
							<Content />
						</VStack>
					</Container>
				</PersistGate>
				<StatusBar style="default" backgroundColor="#69f" />
			</NativeBaseProvider>
		</Provider>
	);
};

export default App;
