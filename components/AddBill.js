import React, { useState } from 'react';
import { Container, Box, Switch } from "native-base";
import { StyleSheet, Text, View } from 'react-native';
import { DateTime } from 'luxon';

const now = DateTime.now();

const AddBill = () => {
	const [isEnabled, setIsEnabled] = useState(false);
	const toggleSwitch = () => setIsEnabled(previousState => !previousState);
	return (
		<Container>
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
				<Text style={styles.text}>{isEnabled ? "Enabled" : "Disabled"}</Text>
 		   </View>
		</Container>
	);
	return (
		<Center>
			<Button onPress={() => setShowModal(true)}>Button</Button>
			<Modal isOpen={showModal} onClose={() => setShowModal(false)}>
				<Modal.Content maxWidth="400px">
					<Modal.CloseButton />
					<Modal.Header>Contact Us</Modal.Header>
					<Modal.Body>
						<FormControl>
							<FormControl.Label>Name</FormControl.Label>
							<Input />
						</FormControl>
						<FormControl mt="3">
							<FormControl.Label>Email</FormControl.Label>
							<Input />
						</FormControl>
					</Modal.Body>
					<Modal.Footer>
						<Button.Group space={2}>
							<Button variant="ghost" colorScheme="blueGray" onPress={() => setShowModal(false)}>Cancel</Button>
							<Button onPress={() => setShowModal(false)}>Save</Button>
						</Button.Group>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
		</Center>
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

export default AddBill;
