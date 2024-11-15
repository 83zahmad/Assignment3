/********************************************************************************
<<<<<<< HEAD
* BTI325 – Assignment 05
=======
* BTI325 – Assignment 04
>>>>>>> 0e130dfd10304a0fdfea2f6d5b13332546705adf
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
<<<<<<< HEAD
* Name: Zeeshaun Ahmad Student ID: 158043224  Date: November 15th 2024
=======
* Name: Zeeshaun Ahmad Student ID: 158043224  Date: November 2nd 2024
>>>>>>> 0e130dfd10304a0fdfea2f6d5b13332546705adf
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

