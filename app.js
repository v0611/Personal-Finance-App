/* Code citation
Date: 11/20/2024
Adapted: SETUP AND LISTENER code
From: cs340-nodejs-starter-app
*/
/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in our code
PORT = 9234;                 // Set a port number at the top so it's easy to change in the future
// Database
var db = require('./database/db-connector');
const transactionTagsRoutes = require('./routes/transactionTagsRoutes');


// Test Database Connection
db.pool.query('SELECT 1', function (err, results) {
    if (err) {
        console.error('Database connection failed:', err.stack);
        process.exit(1); // Exit the app if the database connection fails
    } else {
        console.log('Database connected successfully.');
    }
});



const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
/*
    ROUTES
*/

// GET route
app.get('/', function (req, res) {
    res.redirect('/transactiontags')
    // let query1 = `
    //     SELECT 
    //         Transactions.transactionID, 
    //         Users.userName, 
    //         Categories.categoryName, 
    //         Categories.categoryType,
    //         Transactions.amount, 
    //         DATE_FORMAT(Transactions.date, '%m/%d/%Y') AS formatted_date, 
    //         Transactions.description,
    //         GROUP_CONCAT(Tags.tagName) AS tags
    //     FROM Transactions
    //     JOIN Users ON Transactions.userID = Users.userID
    //     LEFT JOIN Categories ON Transactions.categoryID = Categories.categoryID
    //     LEFT JOIN TransactionTags ON Transactions.transactionID = TransactionTags.transactionID
    //     LEFT JOIN Tags ON TransactionTags.tagID = Tags.tagID
    //     GROUP BY Transactions.transactionID;
    // `;

    // // Execute the query
    // db.pool.query(query1, function (error, rows, fields) {
    //     if (error) {
    //         console.error("Error executing query: ", error);
    //         return res.status(500).send("Error retrieving transactions.");
    //     }

    //     // Send the result to render in handlebard file 
    //     return res.render('index', { data: rows });
    // });
});

app.use('/transactiontags', transactionTagsRoutes);

/*
    LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});


