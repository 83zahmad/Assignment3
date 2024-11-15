/********************************************************************************
* BTI325 – Assignment 05
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Zeeshaun Ahmad Student ID: 158043224  Date: November 15th 2024
*
********************************************************************************/
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
     `./views/**/*.ejs`
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
  daisyui: {
    themes: ["dim"],
  },
}

