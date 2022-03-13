//import React from 'react';
import { extendTheme } from 'native-base';

const themes = {
	Default: {
		colors: {
			blue: {
				50: "#5b3cfe",
				100: "#4622fe",
				200: "#3109fe",
				300: "#2801ec",
				400: "#2301d2",
				500: "#1f01b9",
				600: "#1b01a0",
				700: "#170186",
				800: "#12016d",
				900: "#0e0054"
			},
			green: {
				50: "#55d068",
				100: "#41cb56",
				200: "#35be49",
				300: "#2faa41",
				400: "#2a963a",
				500: "#248232",
				600: "#1e6e2a",
				700: "#195a23",
				800: "#13461b",
				900: "#0e3213"
			},
			red: {
				50: "#fb2249",
				100: "#fa0934",
				200: "#e5042d",
				300: "#cc0428",
				400: "#b30323",
				500: "#9a031e",
				600: "#810319",
				700: "#680214",
				800: "#4f020f",
				900: "#36010b"
			},
			lightBlue: {
				50: "#a0c1d4",
				100: "#8eb5cc",
				200: "#7daac4",
				300: "#6b9ebc",
				400: "#5993b4",
				500: "#4c86a8",
				600: "#447896",
				700: "#3c6a85",
				800: "#345c73",
				900: "#2c4e62"
			},
			rose: {
				50: "#ca7f89",
				100: "#c26d78",
				200: "#bb5b67",
				300: "#b24a58",
				400: "#a0424f",
				500: "#8e3b46",
				600: "#7c343d",
				700: "#6a2c34",
				800: "#58252b",
				900: "#461d22"
			},
			purple: {
				50: "#d229a9",
				100: "#bc2598",
				200: "#a72087",
				300: "#921c75",
				400: "#7c1864",
				500: "#671453",
				600: "#521042",
				700: "#3c0c31",
				800: "#27081f",
				900: "#12030e"
			},
			pink: {
				50: "#ffe2eb",
				100: "#ffc9d9",
				200: "#ffafc7",
				300: "#ff96b6",
				400: "#ff7ca4",
				500: "#ff6392",
				600: "#ff4980",
				700: "#ff306e",
				800: "#ff165d",
				900: "#fc004c"
			},
			orange: {
				50: "#fec173",
				100: "#feb65a",
				200: "#feaa40",
				300: "#fe9f27",
				400: "#fe940e",
				500: "#f18701",
				600: "#d87901",
				700: "#be6b01",
				800: "#a55c01",
				900: "#8b4e01"
			},
			bg: "#070707",
			fg: "#f8f8f8",
			white: '#f8f8f8',
			black: '#070707',
			lightText: '#f8f8f8',
			darkText: '#070707'
		}
	}
};
const mappings = [
	["Default",
		["purple", "rose", "pink", "orange", "lightBlue", "blue", "green", "red"]
	]
];
const themeNames = mappings.map(map => map[0]);
mappings.forEach((map) => {
	const [key, colors] = map;
	const props = ["danger", "error", "success", "warning", "info", "primary", "secondary", "tertiary"];
	colors.forEach(color => {
		const prop = props.shift();
		themes[key][prop] = themes[key][color];
	});
});

const getTheme = (theme) => extendTheme(themes[theme] || {});

export {getTheme as default, themeNames as themes};
