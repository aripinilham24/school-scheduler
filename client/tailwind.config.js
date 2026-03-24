/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				// Primary
				primary: {
					DEFAULT: "#6C63FF",
					foreground: "#FFFFFF",
				},

				// Secondary (soft purple)
				secondary: {
					DEFAULT: "#DDD6FE",
					foreground: "#1F2937",
				},

				// Accent
				accent: {
					DEFAULT: "#F9A8D4",
					foreground: "#1F2937",
				},

				// Background & surface
				background: "#F8FAFC",
				foreground: "#1F2937",

				card: {
					DEFAULT: "#FFFFFF",
					foreground: "#1F2937",
				},

				popover: {
					DEFAULT: "#FFFFFF",
					foreground: "#1F2937",
				},

				// Border & input
				border: "#E5E7EB",
				input: "#E5E7EB",
				ring: "#6C63FF",

				// Status
				muted: {
					DEFAULT: "#F1F5F9",
					foreground: "#6B7280",
				},

				destructive: {
					DEFAULT: "#FF8A7A",
					foreground: "#FFFFFF",
				},
			},

			// Gradient
			backgroundImage: {
				"primary-gradient": "linear-gradient(135deg, #6C63FF, #8A7BFF)",
			},

			// Shadow
			boxShadow: {
				soft: "0 10px 30px rgba(108, 99, 255, 0.2)",
			},

			// Rounded
			borderRadius: {
				xl: "1rem",
				"2xl": "1.5rem",
			},
		},
	},
	plugins: [],
};