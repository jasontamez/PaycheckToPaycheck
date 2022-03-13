import { HStack, Menu, HamburgerIcon, Button, Divider } from "native-base";
import { useSelector } from 'react-redux';

const MyMenu = () => {
	const [bill, payday] = useSelector((state) => [state.bill, state.paycheck]);

	const MenuButton = (triggerProps) => {
		return (
			<Button variant={"unstyled"} {...triggerProps}><HamburgerIcon /></Button>
		);
	};

	const open = () => {};
	const close = () => {};

	const pressed = (which) => {
		console.log("Pressed: " + which);
	};

	return (
		<HStack alignItems={"flex-start"}>
			<Menu onOpen={open} onClose={close} trigger={(triggerProps) => MenuButton(triggerProps)}>
				<Menu.Item onPress={pressed("bill")}>Add {bill}</Menu.Item>
				<Menu.Item onPress={pressed("payday")}>Add {payday}</Menu.Item>
				<Menu.Item onPress={pressed("calc")}>Open Calc</Menu.Item>
				<Divider w="100%" my="2" thickness="2" orientation="horizontal" />
				<Menu.Item onPress={pressed("settings")}>Settings</Menu.Item>
			</Menu>
		</HStack>
	);
}

export default MyMenu;
