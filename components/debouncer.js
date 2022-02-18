let bouncing = null;

const debounce = (func, args, amount = 1000) => {
	if(bouncing) {
		clearTimeout(bouncing);
	}
	bouncing = setTimeout(
		() => {
			bouncing = null;
			func.call(null, ...args);
			// passing null as 'this'
		},
		amount
	);
}

export default debounce;
