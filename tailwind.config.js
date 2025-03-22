/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        black: "#000000",

        gray: {
          900: "#202321",
          800: "#3F4542",
          700: "#5F6863",
          600: "#7F8A85",
          500: "#9FADA6",
          400: "#B2BDB8",
          300: "#C5CEC9",
          200: "#D8DEDB",
          100: "#ECEFED",
          50: "#F7F8F7",
        },

        green: {
          900: "#092607",
          800: "#134B0E",
          700: "#1C7114",
          600: "#26961B",
          500: "#2FBC22",
          400: "#59C94E",
          300: "#82D77A",
          200: "#ACE4A7",
          100: "#D5F2D3",
          50: "#EFFCEE",
        },

        blue: {
          900: "#1E308A",
          800: "#1E36AF",
          700: "#1D3CD8",
          600: "#2557EB",
          500: "#3B79F6",
          400: "#6093FA",
          300: "#93B6FD",
          200: "#BFD4FE",
          100: "#DBE7FE",
          50: "#EFF4FF",
        },

        orange: {
          900: "#7C2D12",
          800: "#9A3412",
          700: "#C2410C",
          600: "#EA580C",
          500: "#F97316",
          400: "#FB923C",
          300: "#FDBA74",
          200: "#FED7AA",
          100: "#FFEDD5",
          50: "#FFF7ED",
        },

        red: {
          900: "#881337",
          800: "#9F1239",
          700: "#BE123C",
          600: "#E11D48",
          500: "#F43F5E",
          400: "#FB7185",
          300: "#FDA4AF",
          200: "#FECDD3",
          100: "#FFE4E6",
          50: "#FFF1F2",
        },

        teal: {
          900: "#115E4D",
          800: "#0F7660",
          700: "#0D9472",
          600: "#37BE9C",
          500: "#4BD2B0",
          400: "#77DAC1",
          300: "#9FE5D3",
          200: "#BFEDE2",
          100: "#DFF6F0",
          50: "#EFFBF8",
        },

        primary: {
          normal: "#4BD2B0",
          strong: "#33CCA6",
          heavy: "#30C09C",
          disable: "#4BD2B033",
        },

        text: {
          normal: "#3F4542",
          strong: "#202321",
          alternative: "#7F8A85",
          assistive: "#9FADA6",
          disable: "#D8DEDB",
          interactive: "#06231C",
          inverse: "#FFFFFF",
        },

        fill: {
          normal: "#7F8A85",
          strong: "#3F4542",
          heavy: "#202321",
          subtle: "#F7F8F7",
        },

        background: {
          normal: "#FFFFFF",
          alternative: "#ECEFED",
        },

        elevation: {
          normal: "#FFFFFF",
          alternative: "#ECEFED",
        },

        line: {
          normal: "#ECEFED",
          alternative: "#F7F8F7",
        },

        status: {
          info: "#6093FA1A",
          cautionary: "#FB923C1A",
          destructive: "#FB71851A",
          positive: "#59C94E1A",
        },

        strong: {
          info: "#3B79F6",
          cautionary: "#F97316",
          destructive: "#F43F5E",
          positive: "#2FBC22",
        },

        static: {
          white: "#FFFFFF",
          black: "#ECEFED",
        },

        material: {
          dimmer: "#00000080",
        },
      },
      fontFamily: {
        cafe24: ["Cafe24Ssurround"],
        pretendard: ["Pretendard"],
      },
      fontSize: {
        heading1: [
          "24px",
          {
            lineHeight: "30px",
            fontWeight: "700",
          },
        ],
        heading2: [
          "20px",
          {
            lineHeight: "26px",
            fontWeight: "700",
          },
        ],

        title1: [
          "24px",
          {
            lineHeight: "30px",
            fontWeight: "700",
          },
        ],
        title2: [
          "20px",
          {
            lineHeight: "26px",
            fontWeight: "700",
          },
        ],
        title3: [
          "18px",
          {
            lineHeight: "24px",
            fontWeight: "700",
          },
        ],
        title4: [
          "16px",
          {
            lineHeight: "20px",
            fontWeight: "700",
          },
        ],
        title5: [
          "14px",
          {
            lineHeight: "20px",
            fontWeight: "700",
          },
        ],

        body1: [
          "16px",
          {
            lineHeight: "22px",
            fontWeight: "500",
          },
        ],
        body2: [
          "14px",
          {
            lineHeight: "20px",
            fontWeight: "500",
          },
        ],
        body3: [
          "13px",
          {
            lineHeight: "18px",
            fontWeight: "500",
          },
        ],
        body4: [
          "12px",
          {
            lineHeight: "18px",
            fontWeight: "500",
          },
        ],

        utility1: [
          "16px",
          {
            lineHeight: "22px",
            fontWeight: "600",
          },
        ],
        utility2: [
          "14px",
          {
            lineHeight: "20px",
            fontWeight: "600",
          },
        ],
        utility3: [
          "13px",
          {
            lineHeight: "18px",
            fontWeight: "600",
          },
        ],
        utility4: [
          "12px",
          {
            lineHeight: "14px",
            fontWeight: "600",
          },
        ],

        bottomNavItem: [
          "10px",
          {
            lineHeight: "18px",
            fontWeight: "600", // SemiBold
          },
        ],
      },
    },
  },
  plugins: [],
};
