// export default {
// 	content: ["./src/**/*.{js,jsx,ts,tsx}"],
// 	theme: {
// 		extend: {},
// 	},
// 	plugins: [],
// };

const konstaConfig = require("konsta/config");

/** @type {import('tailwindcss').Config} */
export default konstaConfig({
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	darkMode: "selector",
	theme: {
		extend: {},
	},
	variants: {
		extend: {},
	},
	plugins: [],
});
