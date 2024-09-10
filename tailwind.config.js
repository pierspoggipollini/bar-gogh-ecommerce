/** @type {import('tailwindcss').Config} */

import defaultTheme from "tailwindcss/defaultTheme"
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      "xs": "375px",
      "2xl": "1920px",
      ...defaultTheme.screens
    },
    extend: {
      colors: {
        "primary": "hsl(33, 41%, 86%)",
        "primary-btn": "hsl(32, 99%, 69%)",
        "primary-hover": "hsl(32, 99%, 74%)",
        "primary-black": "hsl(0, 0%, 12%)",
        "black-hover": "hsl(0, 0%, 30%)",
        "primary-red": "hsl(25, 31%, 20%)",
        "overlay-start": "rgba(0, 0, 0, 0.6)",
        "overlay-finish": "rgba(0, 0, 0, 0.3)",
      },
      backgroundImage: {
        "hero-desk": "url('/src/components/images/header/hero-desk.webp')",
        "hero-mobile": "url('/src/components/images/header/hero-mobile.webp')",
        auth: "url('/src/assets/authlayout.svg')",
        login: "url('/src/components/images/form/signIn.webp')",
        signup: "url('/src/components/images/form/signUp.webp')",
        forgotPassword: "url('/src/components/images/form/forgotPassword.webp')",
        aboutUsHead: "url('/src/components/images/aboutUs/aboutushead.jpeg')",
      },
      borderWidth: {
        '1-1-0-1': ['1px 1px 0px 1px'],
        '0-2-2-0': ['0px 2px 2px 0px'],
        '0-0-1-0': ['0px 0px 1px 0px'],
      },
      boxShadow: {
        'custom': '0 0 10px hsl(32, 99%, 74%)',
      },
      gridTemplateColuns: {
        "confirmation": "200px minmax(900px, 1fr) 100px"
      }
     
    },
  },
  plugins: [],
}

