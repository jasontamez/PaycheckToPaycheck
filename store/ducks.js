//import maybeUpdateTheme from './MaybeUpdateTheme';
//import { StateStorage } from './PersistentInfo';
//import debounce from './debouncer';
import packageJson from '../package.json';
import appJson from '../app.json';
//import { v4 as uuidv4 } from 'uuid';


//
//
// CONSTS
//
//
export let VERSION = {
	current: packageJson.version
};
const p = "paychecktopaycheck/reducer/";
const UPDATE_THEME = p+"UPDATE_THEME";
const SET_PAGE = p+"SET_PAGE";


//
//
// FUNCTIONS
//
//
export function updateTheme(payload) {
	return {type: UPDATE_THEME, payload};
}
export function currentPage(payload) {
	return {type: SET_PAGE, payload};
}


//
//
// VARS AND CONSTS
//
//
export const blankAppState = {
	currentVersion: VERSION.current,
	events: [],
	theme: "Default",
	page: "home"
};
export const blankEvent = {
	startDate = 0,
	amount = 0.0,
	name = ""
};
export const recurrance = {
	period = "w",
	amount = 1,
	last = false,
	repeatOnDay = undefined,
	repeatOnDate = undefined,
	repeatOnWeek = undefined,
	shortMonth = undefined,
	repeatonMonth = undefined
};
export const eventValidator = (recur) => {
	let	startDate = event.startDate,
		amount = event.amount,
		name = event.name,
		description = event.description,
		recurs = event.recurs;
	if(parseInt(startDate) !== startDate) {
		maybeLog("bad startDate");
		return false;
	} else if(typeof amount !== "number" || isNaN(amount) || amount < 0) {
		maybeLog("bad amount");
		return false;
	} else if(typeof name !== "string" || !name) {
		maybeLog("bad name");
		return false;
	}
	// Round amount to two decimal places
	amount = Math.floor((amount + 0.005) * 100) / 100;
	let output = {
		startDate,
		amount,
		name
	};
	if(description) {
		if (typeof description !== "string" || !description) {
			maybeLog("bad description");
			return false;
		}
		output.description = description;
	}
	if (recurs) {
		let validated = recurranceValidator(recurs);
		if(!validated) {
			return false;
		}
		output.recurs = validated;
	}
	return output;
};
const recurranceValidator = (recur) => {
	let	period = recur.period,
		amount = recur.amount,
		last = recur.last,
		repeatOnDay = recur.repeatOnDay,
		shortMonth = recur.shortMonth,
		repeatOnDate = recur.repeatOnDate,
		repeatOnWeek = recur.repeatOnWeek,
		repeatonMonth = recur.repeatonMonth;
	if(period !== "d" && period !== "w" && period !== "m" && period !== "y") {
		maybeLog("bad period");
		return false;
	} else if(typeof amount !== "number" || parseInt(amount) !== amount) {
		maybeLog("bad recur amount");
		return false;
	}
	// period === "d"
	// amount = 23	repeat every 23 days
	let output = {
		period,
		amount
	};
	if(period === "w") {
		// amount = 2		repeat every 2 weeks
		// repeatOnDay = 3	repeat on Wednesday (0 is Sunday, 6 is max)
		if(typeof repeatOnDay !== "number" || parseInt(repeatOnDay) !== repeatOnDay || repeatOnDay > 6 || repeatOnDay < 0) {
			maybeLog("bad w/repeatOnDay");
			return false;
		}
		output.repeatOnDay = repeatOnDay;
	} else if(period === "m") {
		// amount = 2			repeat every 2 months
		// repeatOnDate = 30	repeat on the 30th day
		// last = true				...starting from the 1st
		// last = false				...starting from the last day, counting backwards
		// shortMonth = "this"	if the month has more than (30) days, use the last (or first) day of the same month
		// shortMonth = "next"		...as above, but use the first (or last) day of the next month in counting direction
		//
		// repeatOnDay = 6	repeat on Saturday (0 is Sunday, 6 is max)
		// repeatOnWeek = 4		...the 4th such of the month (1-4 only)
		// last = true			...starting from the 1st of the month
		// last = false			...starting from the last day, counting backwards
		output.last = !!last;
		if(repeatOnDate !== undefined) {
			if(typeof repeatOnDate !== "number" || parseInt(repeatOnDate) !== repeatOnDate || repeatOnDate > 31 || repeatOnDate < 1) {
				maybeLog("bad m/repeatOnDate");
				return false;
			} else if(repeatOnDate > 28) {
				if(shortMonth !== "this" || shortMonth !== "next") {
					maybeLog("bad m/shortMonth");
					return false;
				}
			}
			output = {...output, repeatOnDate, shortMonth};
		} else if (repeatOnDay === undefined || repeatOnWeek === undefined) {
			// Must have Date or Day, and Day must have Week
			maybeLog("missing m/repeatOnDay and/or repeatOnWeek");
			return false;
		} else {
			if(typeof repeatOnDay !== "number" || parseInt(repeatOnDay) !== repeatOnDay || repeatOnDay > 6 || repeatOnDay < 0) {
				maybeLog("bad m/repeatOnDay");
				return false;
			} else if(typeof repeatOnWeek !== "numer" || parseInt(repeatOnWeek) !== repeatOnWeek || repeatOnWeek > 4 || repeatOnWeek < 1) {
				maybeLog("bad m/repeatOnWeek");
				return false;
			}
			output = {...output, repeatOnDay, repeatOnWeek};
		}
	} else if(period === "y") {
		// amount = 2			repeat every 2 years
		// repeatOnMonth = 4	Repeat on April
		// repeatOnDate = 6			...the 6th day of the month
		// shortMonth = "this"	if this is February 29th, use February 28th on non-leap years
		// shortMonth = "next"		...as above, but use March 1st
		let max = 31;
		if(typeof repeatOnMonth !== "number" || parseInt(repeatOnMonth) !== repeatOnMonth || repeatOnMonth > 12 || repeatOnMonth < 1) {
			maybeLog("bad y/repeatOnMonth");
			return false;
		}
		switch(repeatOnMonth) {
			case 2:
				max = 29;
				break;
			case 4:
			case 6:
			case 7:
			case 11:
				max = 30;
		}
		if(typeof repeatOnDate !== "number" || parseInt(repeatOnDate) !== repeatOnDate || repeatOnDate > max || repeatOnDate < 1) {
			maybeLog("bad y/repeatOnDate");
			return false;
		}
		output = {...output, repeatOnDate, repeatOnMonth};
		if(max === 29 && repeatOnDate === 29) {
			if(shortMonth !== "this" || shortMonth !== "next") {
				maybeLog("bad y/shortMonth");
				return false;
			}
			output.shortMonth = shortMonth;
		}
	}
	return output;
};

//
//
// SUB-REDUCERS
//
//
const reduceAll = (state) => {
	let o = {
		currentVersion: state.currentVersion,
		theme: state.theme,
		page: state.page
	};
	return o;
}
export const reduceStatus = (status) => {
	let reduced = {...status};
	return reduced;
};
export const checkIfState = (possibleState) => {
	const check = (possibleState);
	return Object.keys(blankAppState).every((prop) => {
		const p = check[prop];
		return p !== undefined;
	});
};

//
//
// REDUCER
//
//
export function reducer(state, action = {}) {
	const payload = action.payload;
	let final;
	switch(action.type) {
		case UPDATE_THEME:
			final = reduceAll(state);
			final.theme = payload;
			maybeUpdateTheme(state.theme, payload);
			break;
		case SET_PAGE:
			final = reduceAll(state);
			final.page = payload;
			break;
		default:
			return state;
			// NOTE: This will not log anything
	}
	//debounce(saveCurrentState, [final]);
	maybeLog(action.type, final);
	return final;
}

//const saveCurrentState = (state) => {
//	// Make a copy of the state
//	let newState = reduceAll(state);
//	// Save it
//	StateStorage.setItem("lastState", newState);
//	maybeLog("Save", newState);
//};

const maybeLog = (...args) => {
	if(appJson.logging) {
		args.forEach((x) => console.log(x));
	}
};
