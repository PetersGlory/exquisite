const mysql = require("mysql");


const db = mysql.createConnection({
    connectionLimit: process.env.CONNECTION_LIMIT,
    multipleStatements: true,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
});

db.connect(function(err) {
    if (err) {
        console.log("this")
    }else{

        console.log('Database is connected successfully !');
    }
})
module.exports = db;