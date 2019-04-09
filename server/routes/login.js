const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config'); // get our config file
const _ = require('lodash');
var moment = require('moment');
const uuidv4 = require('uuid/v4');
var nodemailer = require('nodemailer');

function createToken(user) {
    const payload = {
        role: user
    };
    var token = jwt.sign(payload, config.secret, {
        expiresIn: 1440000 // expires in 24 hours
    });

    return token;
}

module.exports = function(router){
    router.post('/login', (req, res) => {
        var property = req.body;
    
        let query = "SELECT * FROM user WHERE username = '" + property.userName + "' and BINARY password = '" + property.password + "'";
        db.query(query, function (err, result) {
            if (err) {
                console.log("err ====>", err);
                res.status(400).send({ message: "Unable to connect db!!" })
            } else {
                if (_.size(result) <= 0) {
                    res.status(400).send({ message: "Invalid credentials!!" })
                } else {
                    var user = result[0];
                    var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                    var guid = uuidv4();

                    let sessionLogged = "INSERT INTO `user_session` (user_id, session_token, login_time, is_login) VALUES ('" + user.guid + "','" + guid +"', '"+ mysqlTimestamp +"', true)";
                    db.query(sessionLogged, function (err, result) {
                        if (err) {
                            res.status(400).send({ message: "Unable to connect db for timestamp!!" })
                        } else {
                            res.cookie('guid', guid, { httpOnly: true });
                            res.status(200).send({ message: "Successfully login!!", role: user.role, token: createToken(user.username) })
                        }
                    });
    
                }
            }
        });
    });
    
    router.get('/logout', (req, res) => {
        var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        var logoutQuery = "UPDATE user_session SET logout_time = '" + mysqlTimestamp + "', is_login = false WHERE session_token = '" + req.cookies.guid + "'";
        db.query(logoutQuery, function (err, result) {
            if (err) {
                console.log("err ", err);
                res.status(400).send({ message: "Unable to logout!!" })
            } else {                   
                res.status(200).send({message:'succesfully logout'});
            }
        }); 
    })
    
    router.post('/register', (req, res) => {
        var fields = req.body;
        var guid = uuidv4();
    
        let query = "INSERT INTO `user` (username, password, email, mobile_number, role, guid) VALUES ('" +
            fields.username + "', '" + fields.password + "', '" + fields.email + "', '" + fields.mobileNumber + "', '" + fields.role + "', '" + guid + "')";
    
        db.query(query, function (err, result) {
            if (err) {
                res.status(400).send({ message: "Unable to register!!" })
            } else {
                res.status(200).send({ message: "Successfully register!!" })
            }
        });
    });

    router.get('/resetPassword', (req, res) => {
        var resetPasswordQuery = "SELECT * FROM user WHERE email = '" + req.query.emailId + "'";
        db.query(resetPasswordQuery, function (err, result) {
            if (err) {
                console.log("err ", err);
                res.status(400).send({ message: "Server issue!!" })
            } else { 
                if(_.size(result) > 0){

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
                      
                      transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                          res.status(400).send({message:'Email sender has issue!!'});
                        } else {
                          console.log('Email sent: ' + info.response);
                          res.status(200).send({message:'Succesfully reset password. Please check your email address!!'});
                        }
                      });
                    
                }else{
                    res.status(400).send({message:'Email address not found!!'});
                }                  
                
            }
        }); 
    })
}