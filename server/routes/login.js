const jwt = require('jsonwebtoken');
const config = require('../config'); // get our config file
const _ = require('lodash');
var moment = require('moment');
const uuidv4 = require('uuid/v4');
var nodemailer = require('nodemailer');
var CryptoJS = require("crypto-js");

function createToken(user) {
    const payload = {
        role: user
    };
    var token = jwt.sign(payload, config.secret, {
        expiresIn: 1440000 // expires in 24 hours
    });

    return token;
}

module.exports = function (router) {
    router.post('/login', (req, res) => {
        var property = req.body;

        // Decrypt
        var bytes  = CryptoJS.AES.decrypt(property.password, 'secret key 123');
        property.password = bytes.toString(CryptoJS.enc.Utf8);
        let query = "SELECT * FROM user WHERE username = '" + property.userName + "' and BINARY password = '" + property.password + "'";
        db.query(query, function (err, result) {
            if (err) {
                res.status(400).send({ message: "Unable to connect db!!" })
            } else {
                if (_.size(result) <= 0) {
                    res.status(400).send({ message: "Invalid credentials!!" })
                } else {
                    var user = result[0];
                    var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                    var sessionId = uuidv4();

                    let sessionLogged = "INSERT INTO `user_session` (user_id, session_token, login_time, is_login) VALUES ('" + user.guid + "','" + sessionId + "', '" + mysqlTimestamp + "', true)";
                    db.query(sessionLogged, function (err, result) {
                        if (err) {
                            res.status(400).send({ message: "Unable to connect db for timestamp!!" })
                        } else {
                            res.cookie('sessionId', sessionId, { httpOnly: true });
                            res.cookie('userId', user.guid, { httpOnly: true });
                            res.status(200).send({ message: "Successfully login!!", role: user.role, token: createToken(user.username) })
                        }
                    });

                }
            }
        });
    });

    router.get('/logout', (req, res) => {
        var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        var logoutQuery = "UPDATE user_session SET logout_time = '" + mysqlTimestamp + "', is_login = false WHERE session_token = '" + req.cookies.sessionId + "'";
        db.query(logoutQuery, function (err, result) {
            if (err) {
                res.status(400).send({ message: "Unable to logout!!" })
            } else {
                res.status(200).send({ message: 'Succesfully logout!!' });
            }
        });
    })

    router.post('/register', (req, res) => {
        var fields = req.body;
        let alreadyRegister = "SELECT * FROM user WHERE email = '" + fields.email + "'";
        db.query(alreadyRegister, function (err, result) {
            if (err) {
                res.status(400).send({ message: "Something went wrong, Please try again!!" })
            } else {
                if (_.size(result) > 0) {
                    res.status(400).send({ message: 'User already register!!' });
                } else {
                    var guid = uuidv4();

                    let query = "INSERT INTO `user` (username, password, email, mobile_number, role, guid) VALUES ('" +
                        fields.username + "', '" + fields.password + "', '" + fields.email + "', '" + fields.mobileNumber + "', '" + fields.role + "', '" + guid + "')";

                    db.query(query, function (err, result) {
                        if (err) {
                            res.status(400).send({ message: "Something went wrong, Please try again!!" })
                        } else {
                            res.status(200).send({ message: "Successfully register!!" })
                        }
                    });
                }
            }
        });
    });

    router.post('/changePassword', (req, res) => {
        var fields = req.body;
        // Decrypt
        var bytes  = CryptoJS.AES.decrypt(fields.oldPassword, 'secret key 123');
        fields.oldPassword = bytes.toString(CryptoJS.enc.Utf8);

        // Decrypt
        var bytes  = CryptoJS.AES.decrypt(fields.password, 'secret key 123');
        fields.password = bytes.toString(CryptoJS.enc.Utf8);

        let userId = req.cookies.userId;
        let getUser = "SELECT * FROM user WHERE guid = '" + userId + "' and password = '" + fields.oldPassword + "'";
        
        db.query(getUser, function (err, result) {
            if (err) {
                res.status(400).send({ message: "Something went wrong to connect, Please try again!!" })
            } else {
                if (_.size(result) > 0) {
                    var updatePassword = "UPDATE user SET password = '" + fields.password + "' WHERE guid = '" + userId +"'";
                    db.query(updatePassword, function (err, result) {
                        if (err) {
                            res.status(400).send({ message: "Something went wrong in update, Please try again!!" })
                        } else {
                            res.status(200).send({ message: "Successfully changed password!!" })
                        }
                    });
                } else {
                    res.status(400).send({ message: "Old password not match!!" })
                }
            }
        });
    });

    router.get('/resetPassword', (req, res) => {
        var resetPasswordQuery = "SELECT * FROM user WHERE email = '" + req.query.emailId + "'";
        db.query(resetPasswordQuery, function (err, result) {
            if (err) {
                res.status(400).send({ message: "Server issue!!" })
            } else {
                if (_.size(result) > 0) {

                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'kiran.shinde.git@gmail.com',
                            pass: 'Jamshift@123'
                        }
                    });

                    var mailOptions = {
                        from: 'kiran.shinde.git@gmail.com',
                        to: result[0].email,
                        subject: 'Reset Password!!',
                        text: 'Your password is: ' + result[0].password
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            res.status(400).send({ message: 'Email sender has issue!!' });
                        } else {
                            res.status(200).send({ message: 'Succesfully reset password. Please check your email address!!' });
                        }
                    });

                } else {
                    res.status(400).send({ message: 'Email address not found!!' });
                }

            }
        });
    })
}