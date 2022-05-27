//import maybeUpdateTheme from './MaybeUpdateTheme';
//import { StateStorage } from './PersistentInfo';
//import debounce from './debouncer';
import packageJson from '../package.json';
import appJson from '../app.json';
import { v4 as uuidv4 } from 'uuid';
import { getTodayArray } from '../components/datefuncs';

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
const ADD_BILL = p+"ADD_BILL";
const ADD_PAYDAY = p+"ADD_PAYDAY";
const REMOVE_BILL = p+"REMOVE_BILL";
const REMOVE_PAYDAY = p+"REMOVE_PAYDAY";
const UPDATE_TIMELINE = p+"UPDATE_TIMELINE";
const UPDATE_CALC = p+"UPDATE_CALC";
const SET_TODAY = p+"SET_TODAY";
const SET_PREVIOUS = p+"SET_PREVIOUS";
const SET_NEXT = p+"SET_NEXT";
const SET_TEXT_PROP = p+"SET_TEXT_PROP";


//
//
// FUNCTIONS
//
//
export function addBill(payload) {
	return {type: ADD_BILL, payload};
};
export function addPayday(payload) {
	return {type: ADD_PAYDAY, payload};
};
export function removeBill(payload) {
	return {type: REMOVE_BILL, payload};
};
export function removePayday(payload) {
	return {type: REMOVE_PAYDAY, payload};
};
export function updateTimeline(payload) {
	return {type: UPDATE_TIMELINE, payload};
};
export function updateCalc(payload) {
	return {type: UPDATE_CALC, payload};
};
export function setToday(payload) {
	return {type: SET_TODAY, payload};
};
export function setPrevious(payload) {
	return {type: SET_PREVIOUS, payload};
};
export function setNext(payload) {
	return {type: SET_NEXT, payload};
};
export function updateTheme(payload) {
	return {type: UPDATE_THEME, payload};
}
export function currentPage(payload) {
	return {type: SET_PAGE, payload};
}
export function setTextProp(payload) {
	return {type: SET_TEXT_PROP, payload};
}


//
//
// VARS AND CONSTS
//
//
export const blankAppState = {
	currentVersion: VERSION.current,
	bills: [],		// all bills
	paydays: [],	// all paydays
	timeline: [],	// all bills and paydays, made into sub-bills and sub-paydays and arranged in the given timeframe
	calc: null,	// if null, not in use. otherwise, this is a user-made arrangement of sub-bills and sub-paydays
	today: getTodayArray(),	// [4, 17, 1, 2022] would be Thursday, February 17th, 2022
	previous: 0,	// how far back does the timeline go? is this a set number of days, or a set number of paydays?
	next: 0,		// as above, but for how far into the future
	bill: "bill",
	paycheck: "paycheck",
	aBill: "a bill",
	aPaycheck: "a paycheck",
	theme: "Default",
	page: "home"
};
const blankBill = {
	// id: "",
	subId: null,
	startDate: 0,
	amount: 0.0,
	name: ""
	// description
	// recurs
};
export const makeBlankBill = () => {
	const id = uuidv4();
	return {id, ...blankBill};
};
export const makeSubBill = (bill) => {
	const subId = uuidv4();
	if(bill.subId) {
		maybeLog("sub-bill passed to makeSubBill; " + bill.id + ", " + bill.subId);
		return false;
	}
	return {...bill, subId};
};
const blankPayday = {
	// id: "",
	subId: null,
	startDate: 0,
	workingTotal: 0,
	name: ""
	// description
	// recurs
};
export const makeBlankPayday = () => {
	const id = uuidv4();
	return {id, ...blankPayday};
};
export const makeSubPayday = (payday) => {
	const subId = uuidv4();
	if(payday.subId) {
		maybeLog("sub-payday passed to makeSubPayday; " + payday.id + ", " + payday.subId);
		return false;
	}
	return {...payday, subId};
};
export const recurrance = {
	period: "w",
	amount: 1,
	last: false
	// repeatOnDay: undefined,	// 0-based, day of week
	// repeatOnDate: undefined,	// 1-based, day of month
	// repeatOnWeek: undefined, // 1-based, max 4
	// shortMonth: undefined,	// "this" or "next"
	// repeatOnMonth: undefined	// 0-based
};
export const billValidator = (bill) => {
	let	id = bill.id,
		subId = bill.subId,
		startDate = bill.startDate,
		amount = bill.amount,
		name = bill.name,
		description = bill.description,
		recurs = bill.recurs;
	if(typeof id !== "string" || !id) {
		maybeLog("bad bill id");
		return false;
	} else if(subId !== null && (typeof subId !== "string" || !subId)) {
		maybeLog("bad bill sub-id");
		return false;
	} else if(parseInt(startDate) !== startDate) {
		maybeLog("bad bill startDate");
		return false;
	} else if(typeof amount !== "number" || isNaN(amount) || amount < 0) {
		maybeLog("bad bill amount");
		return false;
	} else if(typeof name !== "string" || !name) {
		maybeLog("bad bill name");
		return false;
	}
	// Round amount to two decimal places
	amount = Math.floor((amount + 0.005) * 100) / 100;
	let output = {
		id,
		subId,
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
export const paydayValidator = (payday) => {
	let	id = payday.id,
		subId = bill.subId,
		startDate = payday.startDate,
		workingTotal = payday.workingTotal,
		name = payday.name,
		description = payday.description,
		recurs = payday.recurs;
	if(typeof id !== "string" || !id) {
		maybeLog("bad payday id");
		return false;
	} else if(subId !== null && (typeof subId !== "string" || !subId)) {
		maybeLog("bad payday sub-id");
		return false;
	} else if(parseInt(startDate) !== startDate) {
		maybeLog("bad payday startDate");
		return false;
	} else if(parseInt(workingTotal) !== workingTotal || workingTotal < 0) {
		maybeLog("bad payday workingTotal");
		return false;
	} else if(typeof name !== "string" || !name) {
		maybeLog("bad payday name");
		return false;
	}
	let output = {
		id,
		subId,
		startDate,
		workingTotal,
		name
	};
	if(description) {
		if (typeof description !== "string" || !description) {
			maybeLog("bad payday description");
			return false;
		}
		output.description = description;
	}
	if (recurs) {
		let validated = recurranceValidator(recurs);
		if(!validated) {
			maybeLog("(bad payday recurs)");
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
		repeatOnMonth = recur.repeatOnMonth;
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
		// last = true				...starting from the first day
		// last = false				...starting from the last day, counting backwards
		// shortMonth = "this"	if the month has more than (30) days, use the last (or first) day of the same month
		// shortMonth = "next"		...as above, but use the first (or last) day of the next month in counting direction
		//
		// repeatOnDay = 6	repeat on Saturday (0 is Sunday, 6 is max)
		// repeatOnWeek = 4		...the 4th such of the month (1-4 only)
		// last = true			...starting from the first day of the month
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
		// repeatOnMonth = 3	Repeat on April (month is 0-11)
		// repeatOnDate = 6			...the 6th day of the month
		// shortMonth = "this"	if this is February 29th, use February 28th on non-leap years
		// shortMonth = "next"		...as above, but use March 1st
		let max = 31;
		if(typeof repeatOnMonth !== "number" || parseInt(repeatOnMonth) !== repeatOnMonth || repeatOnMonth > 12 || repeatOnMonth < 1) {
			maybeLog("bad y/repeatOnMonth");
			return false;
		}
		switch(repeatOnMonth) {
			case 1:	// Feb
				max = 29;
				break;
			case 3:	// Apr
			case 5:	// Jun
			case 8:	// Sep
			case 10:	// Nov
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
const reduceAll = (state) => reduceAllBut(state, []);
const reduceAllBut = (state, buts) => {
	const checkIfPayday = (st) => st.workingTotal || st.workingTotal === 0;
	let skippable = {};
	let output = {...state};
	buts.forEach((but) => {
		skippable[but] = true;
		delete output[but];
	});
	skippable.today || (output.today = [...state.today]);
	skippable.bills || (output.bills = state.bills.map(b => reduceBill(b)));
	skippable.paydays || (output.paydays = state.paydays.map(st => reducePayday(st)));
	skippable.timeline || (output.timeline = state.timeline.map(t => checkIfPayday(t) ? reducePayday(t) : reduceBill(t)));
	if(output.calc) {
		// No need to check skippable because if it's there, it will delete calc and this will not run
		output.calc = state.calc.map(cv => checkIfPayday(cv) ? reducePayday(cv) : reduceBill(cv));
	//} else if (skippable.calc) {
	//	output.calc = null;
	}
	return output;
}
export const reduceBill = (bill) => {
	let output = {...bill};
	output.recurs = reduceRecur(bill.recurs);
	return output;
};
export const reducePayday = (payday) => {
	let output = {...payday};
	output.recurs = reduceRecur(payday.recurs);
	return output;
};
export const reduceRecur = (recur) => {
	return {...recur};
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
		case SET_TEXT_PROP:
			final = reduceAll(state);
			final[payload[0]] = payload[1];
			break;
		case SET_PREVIOUS:
			final = reduceAll(state);
			final.previous = payload;
			break;
		case SET_NEXT:
			final = reduceAll(state);
			final.next = payload;
			break;
		case ADD_BILL:
		case ADD_PAYDAY:
		case REMOVE_BILL:
		case REMOVE_PAYDAY:
		case UPDATE_TIMELINE:
		case UPDATE_CALC:
		case SET_TODAY:
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

export const maybeLog = (...args) => {
	if(appJson.logging) {
		args.forEach((x) => console.log(x));
	}
};
