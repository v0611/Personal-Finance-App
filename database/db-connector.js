require('dotenv').config();

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASSWORD,
    database        : process.env.DB_NAME
})

pool.on('error', (err) => {
    console.error('MySQL pool error:', err);
});

// Export it for use in our applicaiton
module.exports.pool = pool;