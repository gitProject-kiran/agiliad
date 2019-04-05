const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config'); // get our config file
const _ = require('lodash');
var moment = require('moment');
const uuidv4 = require('uuid/v4');

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
}