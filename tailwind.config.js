// /** @type {import('tailwindcss').Config} */
// export default {
// 	content: ["./src/**/*.{js,jsx,ts,tsx}"],
// 	theme: {
// 		extend: {},
// 	},
// 	plugins: [],
// };

const konstaConfig = require("konsta/config");

module.exports = konstaConfig({
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	darkMode: "media",
	theme: {
		extend: {},
	},
	variants: {
		extend: {},
	},
	plugins: [],
});
