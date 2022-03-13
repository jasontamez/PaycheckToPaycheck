export const getTodayArray = () => {
	const now = new Date();
	return [
		now.getDay(),
		now.getDate(),
		now.getMonth(),
		now.getFullYear()
	];	// [4, 17, 1, 2022] would be Thursday, February 17th, 2022
};
