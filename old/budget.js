// Initialize moment.js
moment().format();

// Load variables.
var	scrollable = true,
	paused = false,
	body = document.body,
	dateInfo = {
		w1: [1, "weeks"],
		w2: [2, "weeks"],
		w4: [4, "weeks"],
		m1: [1, "months"],
		m2: [2, "months"],
		m3: [3, "months"],
		m6: [6, "months"],
		y1: [1, "years"],
		pastDefault: [2, "weeks"],
		pastMax: [6, "months"],
		futureDefault: [2, "months"],
		futureMax: [1, "years"],
		us1: "MMMM Do, YYYY",
		us2: "M/D/YYYY",
		uk1: "D/M/YYYY",
		uk2: "D-MMM-YYYY",
		uk3: "D-MMMM-YYYY",
		rev: "YYYY/M/D",
		dateDefault: "D-MMM-YYYY",
		dateTimeFormat: "YYYY-MM-DD",
		billTimeFormat: "bYYYYMMDD",
		payTimeFormat: "pYYYYMMDD",
		moneySymbol: "$",
		moneyDecimal: "."
	},
	buttonsToEnable = [],
	buttonsToDisable = [],
	chosen = [],
	hidden = [],
	now = moment(),
	then,
	willBe,
	maxThen,
	maxWillBe,
	schedule = {
		daily: {
			count: 0
		},
		weekly: {
			count: 0
		},
		monthly: {
			count: 0
		},
		endOfMonthly: {
			count: 0
		},
		yearly: {
			count: 0
		},
		oneTime: {
			count: 0
		},
		display: []
	},
	translate = {
		D: {
			o: schedule.daily,
			name: "daily",
			format: "every [period] day<period>"
		},
		W: {
			o: schedule.weekly,
			name: "weekly",
			format: "every [period] week<period> on {DAY}s"
		},
		M: {
			o: schedule.monthly,
			name: "monthly",
			format: "every [period] month<period> on the ^dayMod^ day of the month"
		},
		E: {
			o: schedule.endOfMonthly,
			name: "endOfMonthly",
			format: "every [period] month<period> on the ^dayMod+-to-last day+last day^ of the month"
		},
		Y: {
			o: schedule.yearly,
			name: "yearly",
			format: "every [period] year<period> on {MONTHDATE}"
		},
		O: {
			o: schedule.oneTime,
			name: "oneTime",
			format: "once"
		},
		r: "recurring bill",
		p: "recurring payday",
		o: "one-time bill"
	},
	scriptInfo = {version: "1.0"},
	x, y, z, j, k, drake;

// Set up event listener (prevent scrolling when dragging)
const listener = function(e) {
	if (!scrollable) {
		e.preventDefault();
	}
}
document.addEventListener('touchmove', listener, { passive:false });

// Set up sweetalert2
function doChoice(doYes, title = "Are you sure?", text = "", confirm = "Do It", doCancel = null) {
	Swal.fire({
		title: title,
		text: text,
		type: "warning",
		showCancelButton: true,
		confirmButtonText: confirm,
		buttonsStyling: false,
		customClass: {
			confirmButton: 'doIt choice',
			cancelButton: 'choice'
		}
	}).then(function(result) {
		if(result.value) {
			doYes();
		} else if (doCancel !== null) {
			doCancel();
		}
	});
}
function announceSuccess(title, text, confirm = "Ok", onAfterClose = null) {
	Swal.fire({
		type: "success",
		title: title,
		text: text,
		confirmButtonText: confirm,
		customClass: {
			confirmButton: 'choice'
		},
		onAfterClose: onAfterClose
	});
}
function announceOops(text, title = "Oops!", confirm = "Ok") {
		Swal.fire({
			type: "error",
			title: title,
			text: text,
			confirmButtonText: confirm,
			customClass: {
				confirmButton: 'choice'
			}
		});
}

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// THINGS TO DO
//
// *Calculate payday info
// *OneTimeBill
// -Ability to modify Items
// *Clone to #calc
// *Drag-n-drop operations with #calc
// *Save to Browser
//  *Load on load
// *Export
// *Import
//
// +FIX DRAGGING ISSUE
// +Limited repeating
// +One-Time option to PayDay button?
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////



//
// Initialize click events
//
document.querySelectorAll("button.main").forEach( btn => btn.addEventListener("click", function() {
	// One of the main buttons.
	// Launches an overlay which should prevent further button-mashing.
	// Set body to prevent scrolling.
	body.classList.add("overlayActive");
}));

function showStuff() {
	// Basic button function: show something.
	//showId showClass showSubclass
	var	d = this.dataset,
		show = d.showId,
		classy = d.showClass,
		subclass = d.showSubclass,
		base = d.baseId,
		disp = d.display.split(","),
		i,display;
	// Show specific ID (if needed).
	if(show !== undefined) {
		// Make copy of disp.
		display = disp.slice();
		show.split(",").forEach(function(q) {
			var x = document.getElementById(q);
			if(x !== null) {
				x.classList.add(display.shift() + "Display");
				// Save for restoration later.
				chosen.push(x);
			}
		});
	}
	if(base !== undefined) {
		// Get base element from which to look for classes.
		base = document.getElementById(base);
		// Add display to all elements inside base with the specified class.
		show = base.getElementsByClassName(classy);
		// Use the first given display.
		display = disp[0] + "Display";
		for (i=0; i<show.length; i++) {
			let item = show[i];
			// Add class.
			item.classList.add(display);
			// Save for restoration later.
			chosen.push(item);
			// Add display to all children with the specified subclass.
			item = item.getElementsByClassName(subclass);
			for (let j=0; j<item.length; j++) {
				let sub = item[i];
				// Add class.
				sub.classList.add(display);
				// Save for restoration later.
				chosen.push(sub);
			}
		}
	}
}
document.querySelectorAll("button.basic").forEach( btn => btn.addEventListener("click", showStuff.bind(btn)));

function chooseDuration() {
	// Siblings of this button should be hidden.
	var sibs = this.parentNode.getElementsByClassName("durationChooser"),i,b,p;
	// Hide other buttons, save them for a reset.
	for (i=0; i<sibs.length; i++) {
		let sibling = sibs[i];
		if(sibling !== this) {
			sibling.classList.add('hidden');
			hidden.push(sibling);
		}
	}
	// This button should be disabled.
	this.disabled = true;
	// Save for a reset.
	buttonsToEnable.push(this);
	// Store dataset in spare variable.
	i = this.dataset;
}
document.querySelectorAll("button.durationChooser").forEach( btn => btn.addEventListener("click", chooseDuration.bind(btn)));



function toggleButton() {
	// Save data for eventual use.
	var d = this.dataset, p = d.prefix, b = document.getElementById(d.button);
	// Find given button.
	b = document.getElementById(d.button);
	// Add prefix to button.
	b.dataset.prefix = p;
	// Enable button.
	b.disabled = false;
	// Save for disabling later.
	buttonsToDisable.push(b);
}
document.querySelectorAll("button.buttonToggle").forEach( btn => btn.addEventListener("click", toggleButton.bind(btn)));

function doToggleCalc() {
	// Toggle the "open" class on the given ID.
	var	btn = document.getElementById("calcToggle"),
		oldText = btn.innerHTML,
		newText = btn.dataset.text,
		calc = document.getElementById("calc").classList,
		dates = document.getElementById("flow").getElementsByClassName("date"),
		i;
	// Toggle draggability of target container.
	if(calc.contains("open")) {
		// If calc is closed, add "open" class to calc, remove "draggable" class from date objects, and remove from drake.
		calc.remove("open");
		for (i=0; i<dates.length; i++) {
			let item = dates[i];
			item.classList.remove("draggable");
			//drake.containers.filter(c => c !== item);
		}
	} else {
		// If calc is open, remove "open" class from calc, give "draggable" class to date objects, and add to drake.
		calc.add("open");
		for (i=0; i<dates.length; i++) {
			let item = dates[i];
			item.classList.add("draggable");
			//drake.containers.push(item);
		}
	}
	// Update dragula.
	dragula.containers = Array.prototype.slice.call(document.getElementsByClassName("draggable"));
//	console.log(drake.containers);
	// Swap button text with text data.
	btn.innerHTML = newText;
	btn.dataset.text = oldText;
}
document.getElementById("calcToggle").addEventListener("click", doToggleCalc);

// Reset everything back to where it was.
document.querySelectorAll("#resetBill,#resetPay,#resetExport,#cancelImport").forEach( btn => btn.addEventListener("click", resetToStart));

function doSubmitBill() {
	// Initialize variables.
	var name, amount, temp, btn = document.getElementById("submitBill"), prefix = btn.dataset.prefix;
	// Get the amount of the bill. Save it as an amount of pennies.
	temp = document.getElementById("amount");
	amount = Math.min(Math.max(parseFloat(temp.value), 0.0), parseFloat(temp.getAttribute("max")));
	amount = parseInt(amount * 100);
	// Find the name of the bill, convert it to safe text.
	temp = document.createTextNode(document.getElementById("billName").value);
	name = getEscapedText(temp).trim();
	if(name === "") {
		name = "Bill";
	}
	if(prefix === "oO") {
		doSubmitOneTime(prefix, name, amount, "bill oneTime");
	} else {
		doSubmitRecurring(prefix, name, amount, "bill recur");
	}
}
document.getElementById("submitBill").addEventListener("click", doSubmitBill);

function doSubmitPay() {
	// Initialize variables.
	var name, temp, btn = document.getElementById("submitPay"), prefix = btn.dataset.prefix;
	// Find the name of the bill, convert it to safe text.
	temp = document.createTextNode(document.getElementById("billName").value);
	name = getEscapedText(temp).trim();
	if(name === "") {
		name = "PAYDAY";
	}
	if(prefix === "oO") {
		doSubmitOneTime(prefix, name, null, "pay oneTime");
	} else {
		doSubmitRecurring(prefix, name, null, "pay recur");
	}
}
document.getElementById("submitPay").addEventListener("click", doSubmitPay);

function doSubmitRecurring(prefix, name, amount, classes) {
	// Initialize variables.
	var	testCase = prefix.slice(-1),
		rDay, rMonth, rYear, rSE, rWD, rNum, temp, startDate, today;
	// Get Day of month.
	temp = document.getElementById(prefix + "Day");
	rDay = Math.min(parseInt(temp.getAttribute("max")), Math.max(1, parseInt(temp.value)));
	// Get Month. 0 = Jan, 11 = Dec
	temp = document.getElementById(prefix + "Month");
	rMonth = Math.min(Math.max(parseInt(temp.options[temp.selectedIndex].value), 0), 11);
	// Get Year.
	temp = document.getElementById(prefix + "Year");
	rYear = Math.min(parseInt(temp.getAttribute("max")), Math.max(parseInt(temp.getAttribute("min")), parseInt(temp.value)));
	// Get Num (various uses)
	temp = document.getElementById(prefix + "Num");
	rNum = Math.min(parseInt(temp.getAttribute("max")), Math.max(parseInt(temp.getAttribute("min")), parseInt(temp.value)));
	if(testCase === "Y") {
		// Send off to be inserted into the schedule.
		addRecurringYearly(then, willBe, name, amount, rNum, rDay, rMonth, rYear, classes, prefix);
	} else if(testCase === "M") {
		// Monthly needs to be from the start or end.
		// True means we start at beginning of month, False means we start at the end.
		temp = document.getElementById(prefix + "StartOrEnd");
		rSE = temp.options[temp.selectedIndex].value === "start";
		// Send off to be inserted into the schedule.
		addRecurringMonthly(then, willBe, name, amount, rDay, rSE, rMonth, rNum, rYear, classes, prefix);
	} else if (testCase === "W") {
		// Weekly needs a weekday.
		// Get day of week. 0 = Sun, 6 = Sat
		temp = document.getElementById(prefix + "Weekday");
		rWD = Math.min(Math.max(parseInt(temp.options[temp.selectedIndex].value), 0), 6);
		// Send off to be inserted into the schedule.
		addRecurringWeekly(then, willBe, name, amount, rNum, rWD, rDay, rMonth, rYear, classes, prefix);
	} else {
		// Daily is left. Send off to be inserted into the schedule.
		addRecurringDaily(then, willBe, name, amount, rNum, rDay, rMonth, rYear, classes, prefix);
	}

	// Reset form elements, etc, back to where they were.
	resetToStart();
	console.log(schedule);
}
function doSubmitOneTime(prefix, name, amount, classes) {
	// Initialize variables.
	var oDay, oMonth, oYear, temp, startDate, today;
	// Get Day of month.
	temp = document.getElementById(prefix + "Day");
	oDay = Math.min(parseInt(temp.getAttribute("max")), Math.max(1, parseInt(temp.value)));
	// Get Month. 0 = Jan, 11 = Dec
	temp = document.getElementById(prefix + "Month");
	oMonth = Math.min(Math.max(parseInt(temp.options[temp.selectedIndex].value), 0), 11);
	// Get Year.
	temp = document.getElementById(prefix + "Year");
	oYear = Math.min(parseInt(temp.getAttribute("max")), Math.max(parseInt(temp.getAttribute("min")), parseInt(temp.value)));
	// Send off to be inserted into the schedule.
	addOneTime(then, willBe, name, amount, oDay, oMonth, oYear, classes, prefix);

	// Reset form elements, etc, back to where they were.
	resetToStart();
	console.log(schedule);
}


// Delete Previously Added Item
function deleteThis() {
	var	id, type, period, itemNum, s, format, x, y, z, i, when, query, title,
		c = this.getAttribute("class"),
		m = c.match(/([pr])([DWMEY])(item[0-9]+)/);
	if(m === null) {
		// Might be a one-timer.
		m = c.match(/(o)(O)(item[0-9]+)/);
		if(m === null) {
			// Error. Shouldn't happen.
			return console.log([this, "could not match class"]);
		}
		// Ok, we're a one-timer.
		// Set variables based on match.
		// Ex: oOitem12 would yield [oOitem12, o, O, item12]
		[id, type, period, itemNum] = m;
//		console.log(m);
		// Set the scheduler object.
		s = schedule.oneTime;
		// Get item object.
		i = s[itemNum];
		// Set the type.
		type = translate[type];
		// Get date.
		when = i.date;
		// Set up pop-up confirm box questions.
		query = "Are you sure you want to delete this " + type + "?";
		title = i.name + " : " + when.format(dateInfo.dateDefault);
		if(i.amount !== null) {
			title += " : " + getMoneyFormat(i.amount);
		}
	} else {
		// Recurring
		// Set variables based on match.
		// Ex: rDitem12 would yield [rDitem12, r, D, item12]
		[id, type, period, itemNum] = m;
		// Set the scheduler object.
		s = schedule[translate[period].name];
		// Get item object.
		i = s[itemNum];
		// Get the item type.
		type = translate[type];
		// Get start date.
		when = i.date;
		// Get description.
		format = translate[period].format;
		// Set up description.
		x = i.period;
		if(x === 1) {
			format = format.replace("[period] ", "").replace("<period>", "");
		} else {
			format = format.replace("[period]", x).replace("<period>", "s");
		}
		x = format.search(/\^dayMod\^/);
		if(x !== -1) {
			y = i.dayMod;
			z = getOrdinal(y);
			format = format.replace("^dayMod^", y.toString() + z);
		} else {
			x = format.match(/\^dayMod\+([^+]+)\+([^+^]+)\^/);
			if(x !== null) {
				y = i.dayMod + 1;
				if(y <= 1) {
					z = x[2];
				} else {
					z = y.toString() + getOrdinal(y) + x[1];
				}
				format = format.replace(x[0], z);
			}
		}
		if(format.search("{DAY}") !== -1) {
			// Weekday
			x = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur"][when.day()] + "day";
			format = format.replace("{DAY}", x);
		} else if (format.search("{MONTHDATE}") !== -1) {
			// Month and day
			x = when.format("MMMM Do");
			format = format.replace("{MONTHDATE}", x);
		}
		query = "Are you sure you want to delete all instances of this " + type + "?";
		title = i.name + " : " + format;
		if(i.amount !== null) {
			title += " : " + getMoneyFormat(i.amount);
		}
	}
	// Save the info for later use.
	schedule.toDelete = {
		scheduler: s,
		item: itemNum,
		c: id
	};
	// Send to sweet alert2
	doChoice(finishDelete, title, query, "Yes, Delete It", function() { delete schedule.toDelete; });
}
function finishDelete() {
	var	d = schedule.toDelete,
		display = schedule.display,
		s = d.scheduler,
		item = d.item,
		c = d.c,
		flow = document.getElementById("flow"),
		items = flow.querySelectorAll("." + c),
		loading = document.getElementById("loading");
	// Show the loading screen.
	loading.classList.add("loading");
	// Go through each item in #flow and remove it from the DOM.
	items.forEach(function(x) {
		var q = x.parentNode;
		x.remove();
		// If the parent only has its <time> left, hide it.
		if(q.children.length === 1) {
			q.classList.add("hidden");
		}
	});
	// Mark as deleted.
	s[item] = null;
	// Remove from display info.
	schedule.display = display.filter(x => x[1] !== c);
	// Recalculate paydays.
	updatePaydays();
	// Remove info.
	delete schedule.toDelete;
	// Remove the loading screen.
	loading.classList.remove("loading");
}

// CALC BUTTONS

function maybeCopyFill() {
	// Check if has contents, ask yes/no.
	if(document.getElementById("calcFlow").children.length > 0) {
		doChoice(doCloneToCalcFlow, "Are you sure?", "This will overwrite all elements currently shown below.");
	} else {
		doCloneToCalcFlow();
	}
}
document.getElementById("copyFill").addEventListener("click", maybeCopyFill);

function doCloneToCalcFlow() {
	var	cFlow = document.getElementById("calcFlow"),
		flow = document.getElementById("flow").children,
		staging = document.createDocumentFragment(),
		items, i, j, bills, paydays;
	// Clear out cFlow.
	cFlow.innerHTML = null;
	// Go through each div.date element.
	for (i = 0; i < flow.length; i++) {
		let temp = flow.item(i);
		// Ignore hidden elements.
		if(temp.getAttribute("class").match(/\bhidden\b/) === null) {
			items = temp.children;
			bills = [];
			paydays = [];
			// Go through items, ignoring <time> at 0-index.
			for (j = 1; j < items.length; j++)  {
				let item = items.item(j);
				// If this is a payday, save to be listed first. Otherwise, save it for later.
				if(item.getAttribute("class").match(/\bpay\b/) !== null) {
					paydays.push(item);
				} else {
					bills.push(item);
				}
			}
			// Go through both arrays and clone elements to staging.
			items = paydays.concat(bills);
			items.forEach(function(item) {
				var clone = item.cloneNode(true);
				staging.appendChild(clone);
			});
		}
	}
	// Looping complete. Move staging to cFlow.
	cFlow.appendChild(staging);
}

// Toggle class on #calcFlow that toggles visibility of <time> objects.
document.getElementById("toggleDates").addEventListener("click", function() {
	document.getElementById("calcFlow").classList.toggle("noTime");
});

function sortCalc() {
	// Sorts by date.
	var	temp = document.createDocumentFragment(),
		cFlow = document.getElementById("calcFlow"),
		kids = Array.prototype.slice.call(cFlow.children);
	// Do the sort.
	kids.sort(function(a, b) {
		var	x = a.getAttribute("class").match(/\b(.)[DWMEYO]item[0-9]+-([0-9]+)/),
			y = b.getAttribute("class").match(/\b(.)[DWMEYO]item[0-9]+-([0-9]+)/),
			diff = parseInt(x[2] + "0") - parseInt(y[2] + "0");
		if(x[1] === "p") {
			diff--;
		}
		if(y[1] === "p") {
			diff++;
		}
		return diff;
	});
	// Add to temp element.
	kids.forEach(function(item) {
		temp.appendChild(item);
	});
	// Move back into calcFlow.
	cFlow.innerHTML = null;
	cFlow.appendChild(temp);
	// Trigger recalc.
	updateCalcs();
}
document.getElementById("sortCalc").addEventListener("click", sortCalc);

document.getElementById("clearCalc").addEventListener("click", function() {
	// Check if has contents, ask yes/no.
	if(document.getElementById("calcFlow").children.length > 0) {
		doChoice(function() { document.getElementById("calcFlow").innerHTML = null; }, "Are you sure?", "This will delete all elements currently shown below.");
	}
	// No need to do anything else!
});


//
// SAVE BUTTONS
//

document.getElementById("saveBrowser").addEventListener("click", function() {
	// Check if we've already saved something.
	if(hasStoredInfo()) {
		doChoice(saveStateAndAnnounce, "Overwrite Data", "Are you sure you want to overwrite the information already in your browser? This cannot be undone.");
	} else {
		saveStateAndAnnounce();
	}
});
function saveStateAndAnnounce() {
	saveState();
	announceSuccess("Saved!", "Information has been saved to your browser and will be reloaded whenever you visit this page.");
}

document.getElementById("clearBrowser").addEventListener("click", function() {
	// Check if we've already saved something.
	if(hasStoredInfo()) {
		doChoice(clearStateAndAnnounce, "Delete budget info", "Are you sure you want to delete your information from your browser? This cannot be undone.");
	} else {
		announceOops("You haven't saved anything to your browser yet.");
	}
});
function clearStateAndAnnounce() {
	clearState();
	announceSuccess("Cleared", "");
}

document.getElementById("loadFromBrowser").addEventListener("click", function() {
	if(!hasStoredInfo()) {
		announceOops("You haven't saved anything to your browser yet.");
		return;
	}
	doChoice(grabSavedStateCarefully, "Load budget info", "Are you sure you want to load saved information from your browser? This will overwrite any existing info and cannot be undone.");
});

document.getElementById("doExport").addEventListener("click", function() {
	// Create text to put in the textarea. #exportBox
	var v = [];
	v.push(JSON.stringify(scriptInfo), stringifySchedule(schedule.daily), stringifySchedule(schedule.weekly), stringifySchedule(schedule.monthly), stringifySchedule(schedule.endOfMonthly), stringifySchedule(schedule.yearly), stringifySchedule(schedule.oneTime));
	v.push(JSON.stringify([document.getElementById("showPrevious").value, document.getElementById("showNext").value, dateInfo.dateDefault, dateInfo.moneySymbol, dateInfo.moneyDecimal]));
	document.getElementById("exportBox").value = v.join("\n");
});

function tryImport() {
	// Attempt to parse input.
	var	errorMessage = false,
		imp = document.getElementById("importBox").value.trim().split(/\n+/),
		objs = ["daily", "weekly", "monthly", "endOfMonthly", "yearly", "oneTime"],
		settings, parsed;
	if(imp.length !== 8) {
		errorMessage = "The input provided is malformed or otherwise incorrect.";
		console.log(imp);
	} else {
		try {
			// Test version number
			parsed = JSON.parse(imp.shift().trim());
			if(parsed.constructor !== Object || parsed.version === undefined) {
				throw "Settings provided had missing or invalid version code.";
			}
			settings = imp.pop().trim();
			parsed = JSON.parse(settings);
			if(parsed.constructor !== Array) {
				throw "Settings provided were not an array.";
			} else {
				// showPrevious
				let x = parsed.shift(), y;
				if(typeof x !== "string") {
					throw "Bad input type for ShowPrevious: " + x.toString();
				}
				x = x.trim();
				if(x.match(/^(?:w[124]|m[1236])$/) === null) {
					throw "Bad input for ShowPrevious: " + x;
				}
				document.getElementById("showPrevious").value = x;
				changeShowPrevious(true);
				// showNext
				x = parsed.shift();
				if(typeof x !== "string") {
					throw "Bad input type for ShowNext: " + x.toString();
				}
				x = x.trim();
				if (x.match(/^(?:w[124]|m[1236]|y1)$/) === null) {
					throw "Bad input for ShowNext: " + x;
				}
				document.getElementById("showNext").value = x;
				changeShowNext(true);
				//dateDefault
				x = parsed.shift();
				if(typeof x !== "string") {
					throw "Bad input type for DateDefault: " + x.toString();
				}
				x = x.trim();
				if(x === dateInfo.us1) {
					document.getElementById("dateFormat").value = "us1";
				} else if (x === dateInfo.us2) {
					document.getElementById("dateFormat").value = "us2";
				} else if (x === dateInfo.uk1) {
					document.getElementById("dateFormat").value = "uk1";
				} else if (x === dateInfo.uk2) {
					document.getElementById("dateFormat").value = "uk2";
				} else if (x === dateInfo.uk3) {
					document.getElementById("dateFormat").value = "uk3";
				} else if (x === dateInfo.rev) {
					document.getElementById("dateFormat").value = "rev";
				} else {
					throw "Bad input for DateDefault: " + x;
				}
				dateInfo.dateDefault = x;
				// moneySymbol
				x = parsed.shift();
				if(typeof x !== "string") {
					throw "Bad input type for moneySymbol: " + x.toString();
				}
				dateInfo.moneySymbol = x.trim();
				// moneyDecimal
				x = parsed.shift();
				if(typeof x !== "string") {
					throw "Bad input type for moneyDecimal: " + x.toString();
				}
				dateInfo.moneyDecimal = x.trim();
			}
		} catch(error) {
			errorMessage = "There was a problem trying to read settings input: " + error;
		}
		if(errorMessage === false) {
			while(imp.length > 0) {
				let i = imp.shift(), s = objs.shift(), t = 0, o, count;
				try {
					o = JSON.parse(i);
				} catch(error) {
					errorMessage = "There was a problem trying to read " + s + " input: " + error;
					break;
				}
				count = o.count;
				while(t < count) {
					t++;
					let item = o["item" + t.toString()];
					if(item !== null) {
						let d = moment(item.date, "YYYYMMDD");
						item.date = d;
					}
				}
				schedule[s] = o;
			}
		}
	}
	if(errorMessage !== false) {
		// Error message.
		announceOops(errorMessage, "Invalid Input");
	} else {
		// Clear current display.
		document.querySelectorAll("#flow div.date div.item").forEach( item => item.remove() );
		document.querySelectorAll("div.date").forEach( date => date.classList.add("hidden") );
		schedule.display = [];
		// Recreate display with new info.
		backFillBills(then, willBe, true);
		// Toggle calc off if it's open.
		if(document.getElementById("calc").classList.contains("open")) {
			doToggleCalc();
		}
		// Success message!
		announceSuccess("Import Successful!", "", "Ok", resetToStart);
	}
}
document.getElementById("tryImport").addEventListener("click", tryImport);


//
// Initialize form events
//

// Change max date when necessary.
function changeMonthFor() {
	modifyDateMaxByMonth(this.value, [document.getElementById(this.dataset.monthFor)]);
}
document.querySelectorAll("select.todayM[data-month-for]").forEach( day => day.addEventListener("change", changeMonthFor.bind(day)));

// Change ordinal suffix based on current value.
function changeOrdinal() {
	document.getElementById(this.dataset.ordinalId).innerHTML = getOrdinal(this.value);
}
function getOrdinal(val) {
	if(val == 1 || val == 21 || val == 31) {
		return "st";
	} else if (val == 2 || val == 22) {
		return "nd";
	} else if (val == 3 || val == 23) {
		return "rd";
	}
	return "th";
}
document.querySelectorAll("input[data-ordinal-id]").forEach( inp => inp.addEventListener("change", changeOrdinal.bind(inp)));

// Change date based on weekday given.
function changedWeekday() {
	var	date = document.getElementById(this.dataset.date),
		month = document.getElementById(this.dataset.month),
		year = document.getElementById(this.dataset.year),
		weekday = parseInt(this.value),
		testdate = grabAMoment(date.value, month.value, year.value),
		testWD = testdate.day(),
		evnt,
		c = 0;
	// Test if the days match.
	while(weekday !== testWD) {
		// Increment counter.
		c++;
		// Increment test day, make sure it's valid.
		testWD++;
		if(testWD >= 7 ) {
			testWD = 0;
		}
	}
	// See if we had to change anything. (If not, no need to do anything else.)
	if(c) {
		// Yup. We changed.
		// Increment testdate by the number of days we went forward.
		testdate.add(c, "days");
		// Change date.
		date.value = testdate.date().toString();
		// Set a property on date to keep it from looping back to us.
		date.dataset.updating = "true";
		// Trigger a change event on date (ordinals and such).
		evnt = new Event("change");
		date.dispatchEvent(evnt);
		// Clear property.
		delete date.dataset.updating;
		// Change month.
		month.value = testdate.month().toString();
		// Change year.
		year.value = testdate.year().toString();
	}
}
document.querySelectorAll("select.weekday").forEach( wkd => wkd.addEventListener("change", changedWeekday.bind(wkd)));

// Change weekday when day/month/year is changed.
function changeWeekday() {
	// To prevent looping, check for a property.
	if(this.dataset.updating === "true") {
		return;
	}
	// Set that property. (Probably don't need it, but let's be careful.)
	this.dataset.updating = "true";
	// Format of data-has-weekday= is "Weekday Day Month Year"
	var wd, day, mon, year, d;
	[wd, day, mon, year] = this.dataset.hasWeekday.split(" ");
	// Create moment based on current values.
	d = grabAMoment(document.getElementById(day).value, document.getElementById(mon).value, document.getElementById(year).value);
	// Set weekday based on current values.
	document.getElementById(wd).value = d.day().toString();
	// Delete property.
	delete this.dataset.updating;
}
document.querySelectorAll("[data-has-weekday]").forEach( inp => inp.addEventListener("change", changeWeekday.bind(inp)));

// Change the format of dates on demand.
function changeDateFormat() {
	var	inp = document.getElementById("dateFormat"),
		format = inp.value,
		old = dateInfo.dateDefault;
	// Check to see if this is a valid format.
	if(dateInfo.hasOwnProperty(format)) {
		// Check to see if this format is different from the old one.
		format = dateInfo[format].slice();
		if(format !== old) {
			// Reset each <time> to the new format.
			document.querySelectorAll("time").forEach(function(timeObj) {
				//var timecode = this.getAttribute("datetime");
				var when = moment(timeObj.dateTime);
				timeObj.innerHTML = when.format(format);
			});
			// Save new format as default.
			dateInfo.dateDefault = format;
		}
	}
}
document.getElementById("dateFormat").addEventListener("change", changeDateFormat);

// Change the show-previous length.
function changeShowPrevious(event = true) {
	var	format = document.getElementById("showPrevious").value, newThen;
	// Sanity check.
	if(!dateInfo.hasOwnProperty(format)) {
		// Bad info.
		console.log("dateInfo." + format + " not found");
		return alert("Bad info in Show Previous.");
	}
	// Get the new period.
	newThen = now.clone().subtract(...dateInfo[format]);
	if(newThen.isSameOrAfter(now)) {
		// This shouldn't happen.
		console.log(["Date after now:", dateInfo[format], format]);
		return alert("Invalid value trying to Show Previous.");
	} else if(newThen.isBefore(maxThen)) {
		// This shouldn't happen, either.
		console.log(["Date before maxThen:", dateInfo[format], format]);
		return alert("Invalid value trying to Show Previous.");
	} else if(newThen.isSame(then)) {
		// Same value. No need to change anything.
		console.log("The same");
		return;
	} else if(newThen.isAfter(then)) {
		console.log("Show fewer.");
		// We are showing fewer dates.
		let test = document.getElementById("flow").getElementsByClassName("date"), toRemove = [], dNum = parseInt(newThen.format("YYYYMMDD"));
		// Test every date in #flow.
		for(let i=0; i<test.length; i++) {
			// Get a moment based on the date's ID.
			let t = test[i], d = moment(t.getAttribute("id"), "YYYYMMDD");
			// If this is older than newThen, it gets removed.
			if(d.isBefore(newThen)) {
				// Have to push this to an array to deal with later, as test is 'live' and will change.
				toRemove.push(t);
			}
		}
		// Remove dates from the display.
		schedule.display = schedule.display.filter(x => x[0] >= dNum);
		// Do the actual deletions.
		while(toRemove.length > 0) {
			let xx = toRemove.pop();
			xx.remove();
		}
	} else {
		console.log("Show more.");
		// We are showing more dates.
		// Create a test date object to use, set a few format veriables, plus find where we are inserting new dates.
		let	test = then.clone(),
			tF = dateInfo.dateDefault,
			dtF = dateInfo.dateTimeFormat,
			bF = dateInfo.billTimeFormat,
			place = document.getElementById("flow");
		// Subtract a day. See if we're still in the correct timeframe.
		while(test.subtract(1, "days").isSameOrAfter(newThen)) {
			// Create new date object.
			let node = "<div id=\"" + test.format(bF)
					+ "\" class=\"date hidden\"><time datetime=\""
					+ test.format(dtF) + "\">" + test.format(tF)
					+ "</time></div>";
			// Insert it into the DOM.
			place.insertAdjacentHTML("afterbegin", node);
		}
		// Send off to add new scheduled items if we've been called by an event.
		if(event !== true) {
			backFillBills(newThen.clone(), then.clone().subtract(1, "days"));
		}
	}
	// Save as the new 'then'
	then = newThen.clone();
}
document.getElementById("showPrevious").addEventListener("change", changeShowPrevious);

// Change the show-previous length.
function changeShowNext(event = true) {
	var	format = document.getElementById("showNext").value, newWillBe;
	// Sanity check.
	if(!dateInfo.hasOwnProperty(format)) {
		// Bad info.
		console.log("dateInfo." + format + " not found");
		return alert("Bad info in Show Previous.");
	}
	// Get the new period.
	newWillBe = now.clone().add(...dateInfo[format]);
	if(newWillBe.isSameOrBefore(now)) {
		// This shouldn't happen.
		console.log(["Date before now:", dateInfo[format], format]);
		return alert("Invalid value trying to Show Next.");
	} else if(newWillBe.isAfter(maxWillBe)) {
		// This shouldn't happen, either.
		console.log(["Date after maxWillBe:", dateInfo[format], format]);
		return alert("Invalid value trying to Show Next.");
	} else if(newWillBe.isSame(willBe)) {
		// Same value. No need to change anything.
		console.log("The same");
		return;
	} else if(newWillBe.isBefore(willBe)) {
		console.log("Show fewer.");
		// We are showing fewer dates.
		let test = document.getElementById("flow").getElementsByClassName("date"), toRemove = [], dNum = parseInt(newWillBe.format("YYYYMMDD"));
		// Test every date in #flow.
		for(let i=0; i<test.length; i++) {
			// Get a moment based on the date's ID.
			let t = test[i], d = moment(t.getAttribute("id"), "YYYYMMDD");
			// If this is ahead of newWillBe, it gets removed.
			if(d.isAfter(newWillBe)) {
				// Have to push this to an array to deal with later, as test is 'live' and will change.
				toRemove.push(t);
			}
		}
		// Remove dates from the display.
		schedule.display = schedule.display.filter(x => x[0] <= dNum);
		// Do the actual deletions.
		while(toRemove.length > 0) {
			let xx = toRemove.pop();
			xx.remove();
		}
	} else {
		console.log("Show more.");
		// We are showing more dates.
		// Create a test date object to use, set a few format veriables, plus find where we are inserting new dates.
		let	test = then.clone(),
			tF = dateInfo.dateDefault,
			dtF = dateInfo.dateTimeFormat,
			bF = dateInfo.billTimeFormat,
			place = document.getElementById("flow");
		// Add a day. See if we're still in the correct timeframe.
		while(test.add(1, "days").isSameOrBefore(newWillBe)) {
			// Create new date object.
			let node = "<div id=\"" + test.format(bF)
					+ "\" class=\"date hidden\"><time datetime=\""
					+ test.format(dtF) + "\">" + test.format(tF)
					+ "</time></div>";
			// Insert it into the DOM.
			place.insertAdjacentHTML("beforeend", node);
		}
		// Send off to add new scheduled items if we've been called by an event.
		if(event !== true) {
			backFillBills(willBe.clone().add(1, "days"), newWillBe.clone());
		}
	}
	// Save as the new 'then'
	willBe = newWillBe.clone();
}
document.getElementById("showNext").addEventListener("change", changeShowNext);



// Reset all button-munging.
function resetToStart() {
	var i,defs;
	// Reset everything back to where it was.
	// Reset form elements that have hardcoded defaults.
	defs = document.getElementsByClassName("hasDefault");
	for (i=0; i<defs.length; i++) {
		let item = defs[i];
		item.value = item.defaultValue;
	}
	// Clear stored info.
	//billInfo = {};
	// Remove Display classes from stored elements.
	chosen.forEach(item => item.classList.remove("blockDisplay", "flexDisplay", "gridDisplay"));
	// Remove hidden class from stored elements.
	hidden.forEach(item => item.classList.remove("hidden"));
	// Clear import/export info.
	document.getElementById("exportBox").value = "";
	document.getElementById("importBox").value = "";
	// Disable what needs to be disabled.
	buttonsToDisable.forEach(function(item) {
		item.disabled = true;
		item.dataset.prefix = "";
	});
	// Enable what needs to be enabled.
	buttonsToEnable.forEach(item => item.disabled = false);
	// Unfreeze the body.
	body.classList.remove("overlayActive");
}






//
// Add bills to schedule
//

// Add a recurring bill with a period in days.
function addRecurringDaily(start, end, name, amount, rNum, rDay, rMonth, rYear, classes, prefix) {
	var	s = schedule.daily, c,
		startdate = grabAMoment(rDay, rMonth, rYear),
		n = parseInt(rNum);
	// Set the start date to the next one to happen.
	while(startdate.isBefore(maxThen)) {
		startdate.add(n, "days");
	}
	// Increment counter.
	s.count++;
	c = s.count.toString();
	// Add to scheduler.
	s["item" + c] = {
		date: startdate.clone(),
		period: n,
		name: name,
		amount: amount
	};
	// Add to screen.
	displayNewItem(start, end, name, amount, classes+" "+prefix, prefix+"item"+c, startdate, [n, "days"]);
}
// Add a recurring bill with a period in weeks.
function addRecurringWeekly(start, end, name, amount, rNum, rWD, rDay, rMonth, rYear, classes, prefix) {
	var	s = schedule.weekly, c,
		startdate = grabAMoment(rDay, rMonth, rYear),
		n = parseInt(rWD);
	// Make sure the starting date is the correct day of the week.
	// If not, jump to the next matching day.
	c = startdate.day();
	if(c !== n) {
		if(n > c) {
			startdate.add(n - c, "days");
		} else {
			startdate.add(7 + n - c, "days");
		}
	}
	// Set n to the number of weeks we jump.
	n = parseInt(rNum);
	// Set the start date to the next one to happen.
	while(startdate.isBefore(maxThen)) {
		startdate.add(n, "weeks");
	}
	// Increment counter.
	s.count++;
	c = s.count.toString();
	// Add to scheduler.
	s["item" + c] = {
		date: startdate.clone(),
		period: n,
		name: name,
		amount: amount
	};
	// Add to screen.
	displayNewItem(start, end, name, amount, classes+" "+prefix, prefix+"item"+c, startdate, [n, "weeks"]);
}
// Add a recurring bill with a period in months.
function addRecurringMonthly(start, end, name, amount, rDay, rSE, rMonth, rNum, rYear, classes, prefix) {
	var	s = schedule.monthly, c,
		startdate,
		n = parseInt(rNum),
		d = parseInt(rDay);
	// Determine the first start date.
	startdate = grabAMoment(rDay, rMonth, rYear);
	if(rSE) {
		// positive. simple.
		// Set the start date to the next one to happen.
		while(startdate.isBefore(maxThen)) {
			startdate.add(n, "months");
		}
	} else {
		// negative. not so simple.
		// change to the endOfMonthly scheduler.
		s = schedule.endOfMonthly;
		// Alter the prefix.
		prefix = prefix.slice(0, -1) + "E";
		// Reduce rDay by 1 since the 1st day would be 0 days from the last day.
		d--;
		// set to end of month.
		startdate.endOf("month").startOf("day");
		// subtract rDay days.
		if(d > 0) {
			startdate.subtract(d, "days");
		}
		while (startdate.isBefore(maxThen)) {
			// Add specified number of months.
			startdate.add(n, "months");
			// Set to end of month.
			startdate.endOf("month").startOf("day");
			// subtract days
			if(d > 0) {
				startdate.subtract(d, "days");
			}
		}
	}
	// Increment counter.
	s.count++;
	c = s.count.toString();
	// Add to scheduler.
	s["item" + c] = {
		date: startdate.clone(),
		dayMod: d,
		period: n,
		name: name,
		amount: amount
	};
	// Add to screen.
	if(rSE) {
		// Start-of-month means it's always on the same date and doesn't need to be adjusted.
		displayNewItem(start, end, name, amount, classes+" "+prefix, prefix+"item"+c, startdate, [n, "months"]);
	} else if(d > 0) {
		// If end of month, and not the last day of the month, advance by months, jump to the end, and then go back the correct number of days.
		displayNewItem(start, end, name, amount, classes+" "+prefix, prefix+"item"+c, startdate, [n, "months"], "month", [d, "days"]);
	} else {
		// If the last day of the month, advance by months then jump to the end.
		displayNewItem(start, end, name, amount, classes+" "+prefix, prefix+"item"+c, startdate, [n, "months"], "month");
	}
}
// Add a recurring bill with a period in years.
function addRecurringYearly(start, end, name, amount, rNum, rDay, rMonth, rYear, classes, prefix) {
	var	s = schedule.yearly, c,
		n = parseInt(rNum),
		startdate = grabAMoment(rDay, rMonth, rYear);
	// Set the start date to the next one to happen.
	while(startdate.isBefore(maxThen)) {
		startdate.add(n, "years");
	}
	// Increment counter.
	s.count++;
	c = s.count.toString();
	// Add to scheduler.
	s["item" + c] = {
		date: startdate.clone(),
		period: n,
		name: name,
		amount: amount
	};
	// Add to screen.
	displayNewItem(start, end, name, amount, classes+" "+prefix, prefix+"item"+c, startdate, [n, "years"]);
}
// Add a one-time bill.
function addOneTime(start, end, name, amount, rDay, rMonth, rYear, classes, prefix) {
	var	s = schedule.oneTime, c,
		startdate = grabAMoment(rDay, rMonth, rYear);
	// Increment counter.
	s.count++;
	c = s.count.toString();
	// Add to scheduler.
	s["item" + c] = {
		date: startdate.clone(),
		name: name,
		amount: amount
	};
	// Add to screen.
	displayNewItem(start, end, name, amount, classes+" "+prefix, prefix+"item"+c, startdate, null);
}


// Display new bill on-screen.
function displayNewItem(pastLimit, futureLimit, name, amount, classes, id, displayDate, add, endOf = false, subtract = false) {
	var format = dateInfo.billTimeFormat, itemPre, itemMid, itemPost, item, datestamp, timeFormat = dateInfo.dateDefault, dateFormat = dateInfo.dateTimeFormat;
	// Construct element for insertion.
	itemPre = "<div class=\"item " + classes + " " + id + " " + id + "-";
	//console.log(["id", id, "classes", classes]);
	itemMid = "\"><time datetime=\"";
	itemPost = "</time><div class=\"name\">" + name + "</div><div class=\"amount\">" + getMoneyFormat(amount) + "</div><div class=\"delete\" title=\"Delete this item\">[X]</div></div>";
	while(displayDate.isSameOrBefore(futureLimit)) {
		// Make sure we're in the recent-enough past.
		if(displayDate.isSameOrAfter(pastLimit)) {
			// Construct text with unique ID.
			datestamp = displayDate.format("YYYYMMDD");
			item = itemPre + datestamp + itemMid + displayDate.format(dateFormat) + "\">" + displayDate.format(timeFormat) + itemPost;
			// Find insertion point.
			let place = document.getElementById(displayDate.format(format));
			//console.log(displayDate.format(format));
			//console.log([...arguments]);
			// Insert info into the DOM.
			place.insertAdjacentHTML("beforeend", item);
			// Make sure this date is displayed.
			place.classList.remove("hidden");
			// Add information to the display array.
			schedule.display.push([parseInt(datestamp), id, id + "-" + datestamp, amount]);
			// Give .delete div a click event.
			place.querySelectorAll("div." + id + " div.delete").forEach( function(del) {
				del.addEventListener("click", deleteThis.bind(del.parentElement));
			});
		}
		// Check to see if we're a one-timer.
		if(add === null) {
			// Break the loop.
			break;
		}
		// Increment date by specified amount.
		displayDate.add(...add);
		// If endOf isn't false, advance to end of the specified period.
		if(endOf !== false) {
			displayDate.endOf(endOf);
		}
		// If subtract isn't false, decerement date by specified amount.
		if(subtract !== false) {
			displayDate.subtract(...subtract);
		}
		// See if we loop.
	}
	if(!paused) {
		updatePaydays();
	}
}

// Print out bills that need to appear now that we have adjusted dates.
function backFillBills(beginDate, endDate, internal = false) {
	var flow = document.getElementById("flow"), epochs = [], i, s, item, loading = document.getElementById("loading");
	// Show the loading screen.
	loading.classList.add("loading");
	// begin/endDate should be clones. We're going to modify them as we go. -- actually, we won't
	if(internal) {
		// We are strictly looking between the two given dates.
		epochs.push([beginDate, endDate]);
	} else {
		// We assume beginDate/endDate are next to the current then/willBe display.
		if(beginDate.isBefore(then)) {
			// We're adding stuff before the currently displayed entries.
			epochs.push([beginDate, then.clone().subtract(1, "days")]);
		}
		if(endDate.isAfter(willBe)) {
			// We're adding stuff after the currently displayed entries.
			epochs.push([willBe.clone().add(1, "days"), endDate]);
		}
	}
	// Pause Payday calculations.
	paused = true;
	// Now need to go through each schedule and send em off to displayNewItem.
	// Daily
	s = schedule.daily;
	for(i = 1; i<=s.count; i++) {
		item = s["item" + i.toString()];
		if(item === null) {
			// Deleted. Ignore.
			continue;
		}
		//console.log(["daily", item]);
		epochs.forEach(function(e) {
			var prefix = "rD", type = "bill ";
			if(item.amount === null) {
				prefix = "pD";
				type = "pay ";
			}
			displayNewItem(e[0], e[1], item.name, item.amount, "recur "+type+prefix, prefix+"item"+i.toString(), item.date.clone(), [item.period, "days"]);
		});
	}
	// Weekly
	s = schedule.weekly;
	for(i = 1; i<=s.count; i++) {
		item = s["item" + i.toString()];
		if(item === null) {
			// Deleted. Ignore.
			continue;
		}
		//console.log(["weekly", item]);
		epochs.forEach(function(e) {
			var prefix = "rW", type = "bill ";
			if(item.amount === null) {
				prefix = "pW";
				type = "pay ";
			}
			displayNewItem(e[0], e[1], item.name, item.amount, "recur "+type+prefix, prefix+"item"+i.toString(), item.date.clone(), [item.period, "weeks"]);
		});
	}
	// Monthly
	s = schedule.monthly;
	for(i = 1; i<=s.count; i++) {
		item = s["item" + i.toString()];
		if(item === null) {
			// Deleted. Ignore.
			continue;
		}
		//console.log(["monthly", item]);
		epochs.forEach(function(e) {
			var prefix = "rM", type = "bill ";
			if(item.amount === null) {
				prefix = "pM";
				type = "pay ";
			}
			displayNewItem(e[0], e[1], item.name, item.amount, "recur "+type+prefix, prefix+"item"+i.toString(), item.date.clone(), [item.period, "months"]);
		});
	}
	s = schedule.endOfMonthly;
	for(i = 1; i<=s.count; i++) {
		let item = s["item" + i.toString()], xx = ["month"];
		if(item === null) {
			// Deleted. Ignore.
			continue;
		}
		//console.log(["month-end", item]);
		if(item.dayMod > 0) {
			xx.push([item.dayMod, "days"]);
		}
		epochs.forEach(function(e) {
			var prefix = "rE", type = "bill ";
			if(item.amount === null) {
				prefix = "pE";
				type = "pay ";
			}
			displayNewItem(e[0], e[1], item.name, item.amount, "recur "+type+prefix, prefix+"item"+i.toString(), item.date.clone(), [item.period, "months"], ...xx);
		});
	}
	// Yearly
	s = schedule.yearly;
	for(i = 1; i<=s.count; i++) {
		item = s["item" + i.toString()];
		if(item === null) {
			// Deleted. Ignore.
			continue;
		}
		//console.log(["yearly", item]);
		epochs.forEach(function(e) {
			var prefix = "rY", type = "bill ";
			displayNewItem(e[0], e[1], item.name, item.amount, "recur "+type+prefix, prefix+"item"+i.toString(), item.date.clone(), [item.period, "years"]);
		});
	}
	// One-Time
	s = schedule.oneTime;
	for(i = 1; i<=s.count; i++) {
		item = s["item" + i.toString()];
		if(item === null) {
			// Deleted. Ignore.
			continue;
		}
		epochs.forEach(function(e) {
			var prefix = "oO", type = "bill ";
			if(item.amount === null) {
				prefix = "oO";
				type = "pay ";
			}
			displayNewItem(e[0], e[1], item.name, item.amount, "oneTime "+type+prefix, prefix+"item"+i.toString(), item.date.clone(), null);
		});
	}

	// Unpause calculations, and trigger them.
	paused = false;
	updatePaydays();
	// Remove the loading screen.
	loading.classList.remove("loading");
}

// Total up every payday.
function updatePaydays() {
	var d = schedule.display, listings, runningTotal = 0, flow = document.getElementById("flow");
	// Sort display, which should be by the first element (date in integer format) of each element.
	// But we're going to reverse everything so the math works.
	d.sort(function(a, b) {
		var x = a[0], y = b[0];
		// push paydays to end of the line.
		if(x === y) {
			if (a[3] === b[3]) {
				return 0;
			} else if (a[3] === null) {
				return 1;
			} else if (b[3] === null) {
				return -1;
			}
			return 0;
		}
		return y - x;
	});
	// Get a copy of the display listings.
	listings = d.slice();
	while(listings.length > 0) {
		let date, item, id, amount;
		[date, item, id, amount] = listings.shift();
		// Is this a payday?
		if(amount === null) {
			// Yes
			// Find where we need to update (class should be unique, and should have only one "amount").
			//console.log({id: id, total: runningTotal});
			let found = flow.getElementsByClassName(id).item(0).getElementsByClassName("amount").item(0);
			// Change the displayed amount to the running total.
			found.innerHTML = getMoneyFormat(runningTotal);
			// Clear running total.
			runningTotal = 0;
		} else {
			// Not a payday.
			// Add the given amount to the running total.
			runningTotal += amount;
			//console.log({id: id, amount: amount});
		}
	}
}

// Update paydays in calc area.
function updateCalcs() {
	var listings = [], runningTotal = 0, cFlow = document.getElementById("calcFlow").children;
	// Create an array of display listings, based on the root nodeList.
	Array.prototype.forEach.call(cFlow, function (x) {
		var m, amount, aNode;
		// Extract the Amount
		m = x.getAttribute("class").match(/\b.([DWMEYO])(item[0-9]+)/);
//		amount = translate[m[1]].o[m[2]].amount;
//		console.log(["updateCalc", x.getAttribute("class"), m]);
		amount = schedule[translate[m[1]].name][m[2]].amount;
		// Get the "amount" element.
		aNode = x.children.item(2);
		// Save values.
		listings.push([amount, aNode]);
	});
	while(listings.length > 0) {
		let amount, node;
		[amount, node] = listings.pop();
		// Is this a payday?
		if(amount === null) {
			// Yes
			// Change the displayed amount to the running total.
			node.innerHTML = getMoneyFormat(runningTotal);
			// Clear running total.
			runningTotal = 0;
		} else {
			// Not a payday.
			// Add the given amount to the running total.
			runningTotal += amount;
		}
	}
}

// Format given amount of pennies into a dollar/euro/pound/whatever string.
function getMoneyFormat(amount) {
	if(amount === null) {
		return "";
	}
	var	symbol = dateInfo.moneySymbol,
		decimal = dateInfo.moneyDecimal,
		dollars = Math.floor(amount / 100),
		cents = amount % 100;
	if(cents < 10) {
		cents = "0" + cents.toString();
	} else {
		cents = cents.toString();
	}
	return symbol + dollars.toString() + decimal + cents;
}


//
// Other useful functions
//

// Given a text node, extract the text.
function getEscapedText(node) {
	var div = document.createElement('div');
	div.appendChild(node);
	return div.innerHTML;
}

// Return a moment/date object for the given date.
function grabAMoment(d = dateInfo.day, m = dateInfo.month, y = dateInfo.year) {
	if(d < 10) {
		d = "0" + d;
	}
	m = parseInt(m) + 1;
	m = m.toString();
	if(m < 10) {
		m = "0" + m;
	}
	return moment(y + "-" + m + "-" + d);
}


// Modify date maxes based on month.
function modifyDateMaxByMonth(month, where = document.getElementsByClassName("dayInput")) {
	var max = 31, i;
	if(month == 1) {
		// Feb - not messing with leap years
		max = 28;
	} else if (month == 3 || month == 5 || month == 8 || month == 10) {
		// Apr, Jun, Sep, Nov
		max = 30;
	}
	for (i=0; i<where.length; i++) {
		let item = where[i];
		if(item.value > max) {
			item.value = max;
		}
		item.setAttribute("max", max.toString());
	}
}

// Save info to browser.
function saveState() {
	localStorage.setItem("BUDGETversion", JSON.stringify(scriptInfo));
	localStorage.setItem("BUDGETdaily", stringifySchedule(schedule.daily));
	localStorage.setItem("BUDGETweekly", stringifySchedule(schedule.weekly));
	localStorage.setItem("BUDGETmonthly", stringifySchedule(schedule.monthly));
	localStorage.setItem("BUDGETendOfMonthly", stringifySchedule(schedule.endOfMonthly));
	localStorage.setItem("BUDGETyearly", stringifySchedule(schedule.yearly));
	localStorage.setItem("BUDGEToneTime", stringifySchedule(schedule.oneTime));
	localStorage.setItem("BUDGETsettings", JSON.stringify([document.getElementById("showPrevious").value, document.getElementById("showNext").value, dateInfo.dateDefault, dateInfo.moneySymbol, dateInfo.moneyDecimal]));
}
// Clear info from browser.
function clearState() {
	const values = ["version", "daily", "weekly", "monthly", "endOfMonthly", "yearly", "oneTime", "settings"];
	values.forEach(item => localStorage.removeItem("BUDGET" + item));
}
// Check if we have any stored info.
function hasStoredInfo() {
	return localStorage.getItem("BUDGETsettings") !== null;
}
// Return given schedule object as a string.
function stringifySchedule(o) {
	var	count = o.count,
		actualCount = 0,
		test = { count: 0 },
		t = 0,
		i;
	// Create a copy of the schedule object.
	while(t < count) {
		t++;
		let item = o["item" + t.toString()];
		// Skip null items.
		if(item !== null) {
			actualCount++;
			i = "item" + actualCount.toString();
			test[i] = {};
			Object.keys(item).forEach( name => test[i][name] = item[name] );
			// Convert moments to strings for easier porting.
			test[i].date = item.date.format("YYYYMMDD");
		}
	}
	test.count = actualCount;
	return JSON.stringify(test);
}
// Restore given schedule object from browser-saved info.
function parseSchedule(s) {
	// Get saved info.
	var	o = JSON.parse(localStorage.getItem("BUDGET" + s)),
		t = 0, count;
	// No longer needed since we're eliminating the null items!
	//if(o === null) {
	//	// This one doesn't exist.
	//	return;
	//}
	count = o.count;
	// Convert YYYYMMDD date strings to moment objects.
	while(t < count) {
		t++;
		let item = o["item" + t.toString()];
		if(item !== null) {
			let d = moment(item.date, "YYYYMMDD");
			item.date = d;
		}
	}
	// Set schedule to new object.
	schedule[s] = o;
}

// Restore information from browser-saved data.
function grabSavedStateCarefully() {
	document.querySelectorAll("#flow div.date div.item").forEach( item => item.remove() );
	document.querySelectorAll("div.date").forEach( date => date.classList.add("hidden") );
	grabSavedState();
}
function grabSavedState() {
	var	sp, sn, dd, ms, md, th, wb,
		dateTimeFormat = dateInfo.dateTimeFormat,
		flow = document.getElementById("flow"),
		btf = dateInfo.billTimeFormat,
		frag = document.createDocumentFragment(),
		temp = false;
	schedule.display = [];
	parseSchedule("daily");
	parseSchedule("weekly");
	parseSchedule("monthly");
	parseSchedule("endOfMonthly");
	parseSchedule("yearly");
	parseSchedule("oneTime");
	[sp, sn, dd, ms, md] = JSON.parse(localStorage.getItem("BUDGETsettings"))
	//then = moment(th, "YYYYMMDD");
	//willBe = moment(wb, "YYYYMMDD");
	if(ms !== null && ms !== dateInfo.moneySymbol) {
		temp = true;
		dateInfo.moneySymbol = ms;
	}
	if(md !== null && md !== dateInfo.moneyDecimal) {
		temp = true;
		dateInfo.moneyDecimal = md;
	}
	if(temp) {
		// Change money values.
		//
		//
		//
		temp = false;
	}
	if(dd !== null && dd !== dateInfo.dateDefault) {
		temp = document.getElementById("dateFormat");
		let qq = temp.getElementsByTagName("option"), o;
		for (o of qq) {
//			console.log(o.value);
			if (dd === dateInfo[o.value]) {
				temp.value = o.value;
				break;
			}
		}
		dateInfo.dateDefault = dd;
	}
	document.getElementById("showPrevious").value = sp;
	changeShowPrevious(true);
	document.getElementById("showNext").value = sn;
	changeShowNext(true);
	//temp = then.clone();
	//while(willBe.isSameOrAfter(temp)) {
	//	let div = document.createElement("div");
	//	div.classList.add("date", "hidden");
	//	div.setAttribute("id", temp.format(btf));
	//	div.innerHTML = "<time datetime=\"" + temp.format(dateTimeFormat) + "\">" + temp.format(dd) + "</time>";
	//	frag.appendChild(div);
	//	temp.add(1, "days");
	//}
	//flow.innerHTML = null;
	//flow.appendChild(frag);
	backFillBills(then, willBe, true);
	temp = document.getElementById("calc");
	if(temp.classList.contains("open")) {
		doToggleCalc();
	}
}






//
// Initialize stuff at page load.
//

// Set day of the week.
//x = now.day().toString();
//$(".todayWD").each(function() {
//	this.value = x;
//	//$(this).find("option[value=\"" + x + "\"]").prop("selected", true);
//});
// Set the year, and set mins and maxes 10 years in either direction
x = now.year();
document.querySelectorAll(".todayY").forEach(function(inp) {
	inp.value = x.toString();
	inp.setAttribute("max", String(x + 10));
	inp.setAttribute("min", String(x - 10));
});
// Set month of the year
z = now.month().toString();
document.querySelectorAll(".todayM option[value=\"" + z + "\"]").forEach( inp => inp.setAttribute("selected", true));
// Set day of the month
y = now.date().toString();
document.querySelectorAll(".todayD").forEach(function(inp) {
	inp.value = Math.min(parseInt(y), parseInt(inp.getAttribute("max"))).toString();
});
// Modify ordinal suffixes.
document.querySelectorAll("input[data-ordinal-id]").forEach( inp => changeOrdinal.bind(inp).call() );
// Modify weekdays.
document.querySelectorAll(".todayM[data-has-weekday]").forEach(month => changeWeekday.bind(month).call() );

// Store info from now.
dateInfo.year = x.toString();
dateInfo.month = z;
dateInfo.day = y;
// Reset now to the beginning of today.
now = grabAMoment(y, z, x);
// Initialize then based, maxThen, willBe and maxWillBe on today.
// then = limit of past display
// maxThen = the farthest past display possible
// willBe = limit of future display
// maxWillBe = the farthest future display possible
then = now.clone();
then.subtract(...dateInfo.pastDefault);
maxThen = now.clone();
maxThen.subtract(...dateInfo.pastMax);
willBe = now.clone();
willBe.add(...dateInfo.futureDefault);
maxWillBe = now.clone();
maxWillBe.add(...dateInfo.futureMax);
// Modify date maxes based on month.
modifyDateMaxByMonth(z);
// Set up dates in #flow
x = then.clone();
y = dateInfo.dateDefault;
z = dateInfo.dateTimeFormat;
j = document.getElementById("flow");
k = dateInfo.billTimeFormat;
//while(willBe.isSameOrAfter(x)) {
//	j.append("<div class=\"date hidden\" id=\"" + x.format(k) + "\"><time datetime=\"" + x.format(z) + "\">" + x.format(y) + "</time></div>");
//	x.add(1, "days");
//}
while(willBe.isSameOrAfter(x)) {
	let qq = document.createElement("div");
	qq.classList.add("date", "hidden");
	qq.setAttribute("id", x.format(k));
	qq.innerHTML = "<time datetime=\"" + x.format(z) + "\">" + x.format(y) + "</time>";
	j.appendChild(qq);
	x.add(1, "days");
}
// If info has been saved, restore it.
if(hasStoredInfo()) {
	grabSavedState(true);
}
//$("#q20190412,#q20190422,#q20190502,#q20190601,#q20190515").removeClass("hidden");




//
// Set up draggable sections
//

function checkClassLists(el, cls, levels) {
	if(el.classList.contains(cls)) {
		return true;
	}
	levels--;
	el = el.parentElement;
	if(levels > 0 && el !== null) {
		return checkClassLists(el, cls, levels);
	}
	return false;
}
drake = dragula([], {
	isContainer: function (el) {
		//console.log("iscontainer");
		//console.log(el);
		var value = el.classList.contains('draggable');
		//console.log(value);
		return value;
		//return el.classList.contains('draggable');
	},
	moves: function (el, source, handle, sibling) {
		//console.log("moves");
		//console.log([el, source, handle, sibling]);
		return checkClassLists(el, "item", 2);
		//return true; // elements are always draggable by default
	},
	accepts: function (el, target, source, sibling) {
		//console.log("accepts");
		//console.log([el, target, source, sibling]);
		return target === document.getElementById("calcFlow");
	},
	copy: function(el, source) {
		//console.log("copy");
		//console.log([el, source]);
		//return el.classList.contains("item") && (source.classList.contains("date") || source === document.getElementById("calcFlow"));
		return el.classList.contains("item") && source.classList.contains("date");
	},
	invalid: function (el, handle) {
		//console.log("invalid");
		//console.log([el, handle]);
		//return false && $(handle).parents('.item').length > 0;
		return !checkClassLists(el, "item", 2);
	},
	direction: 'vertical',			// Y axis is considered when determining where an element would be dropped
	copySortSource: false,			// elements in copy-source containers can be reordered
	revertOnSpill: true,			// spilling will put the element back where it was dragged from, if this is true
	removeOnSpill: true,			// spilling will `.remove` the element, if this is true
	mirrorContainer: body,			// set the element that gets mirror elements appended
	ignoreInputTextSelection: true	// allows users to select input text, see details below
}).on('drag', function(el, source) {	// prevent scrolling
	scrollable = false;
}).on('drop', function(el, target, source, sibling) {	// while dragging
	scrollable = true;
	if(target.getAttribute("id") === "calcFlow") {
		// Do calcs.
		updateCalcs();
	}
}).on('remove', function(el, container, source) {  // When removing stuff from the calc
	if(container.getAttribute("id") === "calcFlow") {
		// Do calcs.
		updateCalcs();
	}
});

