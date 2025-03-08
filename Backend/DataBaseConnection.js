require('dotenv').config();
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//connect to the database
connection.connect(function (error) {
    if (error) //
        console.error("Database connection failed: ", error.stack);
    else console.log("Connect to the database successfully. http://localhost:" + process.env.APP_PORT)
});

// Export the connection to use in other files
module.exports = connection;