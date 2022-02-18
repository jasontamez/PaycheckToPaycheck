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
const p = "haphazard-inspiration/reducer/";
const OVERWRITE_STATE = p+"OVERWRITE_STATE";
const UPDATE_THEME = p+"UPDATE_THEME";
const SET_PAGE = p+"SET_PAGE";


//
//
// FUNCTIONS
//
//
export function overwriteState(payload) {
	return {type: OVERWRITE_STATE, payload};
}
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
	theme: "Default",
	page: "home"
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
		case OVERWRITE_STATE:
			final = reduceAll(payload);
			maybeUpdateTheme(state.theme, final.theme);
			break;
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
