var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'ashmita.c1blwhyi198i.ap-south-1.rds.amazonaws.com',
    user     : 'Shinde9271986150',
    password : 'shinde.MB12',
    port    :3306,
    database:'ashmitaDB',
    connectTimeout : 250000,
});

// connect to database
connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

global.db = connection;