
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
    let query1 = `
        SELECT 
            Transactions.transactionID, 
            Users.userName, 
            Categories.categoryName, 
            Categories.categoryType,
            Transactions.amount, 
            DATE_FORMAT(Transactions.date, '%m/%d/%Y') AS formatted_date, 
            Transactions.description,
            GROUP_CONCAT(Tags.tagName) AS tags
        FROM Transactions
        JOIN Users ON Transactions.userID = Users.userID
        LEFT JOIN Categories ON Transactions.categoryID = Categories.categoryID
        LEFT JOIN TransactionTags ON Transactions.transactionID = TransactionTags.transactionID
        LEFT JOIN Tags ON TransactionTags.tagID = Tags.tagID
        GROUP BY Transactions.transactionID;
    `;

    // Execute the query
    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.error("Error executing query: ", error);
            return res.status(500).send("Error retrieving transactions.");
        }

        // Pass the formatted data to the template
        return res.render('index', { data: rows });
    });
});

app.use('/transactiontags', transactionTagsRoutes);


// DELETE ROUTE
app.delete('/delete-person-ajax/', function (req, res, next) {
    let data = req.body;
    let personID = parseInt(data.id);
    let deleteBsg_Cert_People = `DELETE FROM bsg_cert_people WHERE pid = ?`;
    let deleteBsg_People = `DELETE FROM bsg_people WHERE id = ?`;


    // Run the 1st query
    db.pool.query(deleteBsg_Cert_People, [personID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            // Run the second query
            db.pool.query(deleteBsg_People, [personID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

app.put('/put-person-ajax', function (req, res, next) {
    let data = req.body;

    let homeworld = parseInt(data.homeworld);
    let person = parseInt(data.fullname);

    let queryUpdateWorld = `UPDATE bsg_people SET homeworld = ? WHERE bsg_people.id = ?`;
    let selectWorld = `SELECT * FROM bsg_planets WHERE id = ?`

    // Run the 1st query
    db.pool.query(queryUpdateWorld, [homeworld, person], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectWorld, [homeworld], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});



/*
    LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});


