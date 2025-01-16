 /********************************************************************************
* BTI325 – Assignment 06
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Zeeshaun Ahmad Student ID: 158043224  Date: December 8th 2024
*
********************************************************************************/
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
let Schema = mongoose.Schema;
require('dotenv').config();

let db;
let User; 

 

let userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true 
    },
    password: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true 
    },
    loginHistory: [
        {
            dateTime: {
                type: Date, 
                required: true 
            },
            userAgent: {
                type: String, 
                required: true 
            }
        }
    ]
});


function initialize() {
    return new Promise ((resolve,reject) =>{
       db = mongoose.createConnection(process.env.MONGODB);
       db.on('error,', (err) => {
        reject(err);
       });

       db.once('open', () => {
        User = db.model("users", userSchema);
        resolve();
       })
    })
}

function registerUser(userData) {
    return new Promise((resolve, reject) => {
        if (userData.password !== userData.password2) {
            reject("Passwords do not match");
            return;
        }
        bcrypt.hash(userData.password, 10)
            .then(hash => {
                userData.password = hash;
                let newUser = new User({
                    userName: userData.userName,
                    password: userData.password,
                    email: userData.email,
                    loginHistory: []
                });
                newUser.save()
                    .then(() => resolve())
                    .catch(err => {
                        if (err.code === 11000) { 
                            reject("User Name already taken");
                        } else {
                            reject(`There was an error creating the user: ${err}`);
                        }
                    });
            })
            .catch(() => {
                reject("There was an error encrypting the password");
            });
    });
}


function checkUser(userData) {
    return new Promise((resolve, reject) => {
        User.findOne({ userName: userData.userName })
            .then(user => {
                if (!user) {
                    reject(`Unable to find user: ${userData.userName}`);
                } else {
                    bcrypt.compare(userData.password, user.password)
                        .then(isMatch => {
                            if (!isMatch) {
                                reject(`Incorrect Password for user: ${userData.userName}`);
                            } else {
                                if (user.loginHistory.length === 8) {
                                    user.loginHistory.pop();
                                }
                                user.loginHistory.unshift({
                                    dateTime: new Date().toString(),
                                    userAgent: userData.userAgent
                                });
                                User.updateOne(
                                    { userName: user.userName },
                                    { $set: { loginHistory: user.loginHistory } }
                                )
                                    .then(() => resolve(user))
                                    .catch(err => {
                                        reject(`There was an error verifying the user: ${err}`);
                                    });
                            }
                        })
                        .catch(() => {
                            reject("There was an error verifying the password");
                        });
                }
            })
            .catch(() => {
                reject(`Unable to find user: ${userData.userName}`);
            });
    });
}



module.exports = {initialize, registerUser,checkUser}