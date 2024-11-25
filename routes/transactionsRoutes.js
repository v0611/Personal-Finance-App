/* Code citation
Date: 11/20/2024
Adapted: fetching data 
From: cs340-nodejs-starter-app
*/

const express = require('express');
const router = express.Router();
const db = require('../database/db-connector');

// GET route for rendering the transactions page with dropdown data
router.get('/', function(req, res) {
    const transactionsQuery = `
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

    const usersQuery = `SELECT userID AS id, userName FROM Users;`;
    const categoriesQuery = `SELECT categoryID AS id, categoryName FROM Categories;`;
    const tagsQuery = `SELECT tagID AS id, tagName FROM Tags;`;

    // Execute all queries
    db.pool.query(transactionsQuery, function(error, transactionsRows) {
        if (error) {
            console.error("Error executing transactions query:", error);
            return res.status(500).send("Error retrieving transactions.");
        }

        db.pool.query(usersQuery, function(error, usersRows) {
            if (error) {
                console.error("Error fetching users:", error);
                return res.status(500).send("Error fetching users.");
            }

            db.pool.query(categoriesQuery, function(error, categoriesRows) {
                if (error) {
                    console.error("Error fetching categories:", error);
                    return res.status(500).send("Error fetching categories.");
                }

                db.pool.query(tagsQuery, function(error, tagsRows) {
                    if (error) {
                        console.error("Error fetching tags:", error);
                        return res.status(500).send("Error fetching tags.");
                    }

                    // Render the page with the data
                    res.render('transactions', {
                        data: transactionsRows,
                        users: usersRows,
                        categories: categoriesRows,
                        tags: tagsRows
                    });
                });
            });
        });
    });
});

router.get('/filter', function (req, res) {
    const { userID } = req.query;

    let filterQuery;

    if (userID) {
        filterQuery = `
            SELECT 
                t.transactionID,
                u.userName,
                c.categoryName,
                c.categoryType,
                t.amount,
                DATE_FORMAT(t.date, '%m/%d/%Y') AS formatted_date,
                t.description,
                GROUP_CONCAT(tags.tagName) AS tags
            FROM Transactions t
            JOIN Users u ON t.userID = u.userID
            LEFT JOIN Categories c ON t.categoryID = c.categoryID
            LEFT JOIN TransactionTags tt ON t.transactionID = tt.transactionID
            LEFT JOIN Tags tags ON tt.tagID = tags.tagID
            WHERE u.userID = ${userID}
            GROUP BY t.transactionID;
        `;
    } else {
        filterQuery = `
            SELECT 
                t.transactionID,
                u.userName,
                c.categoryName,
                c.categoryType,
                t.amount,
                DATE_FORMAT(t.date, '%m/%d/%Y') AS formatted_date,
                t.description,
                GROUP_CONCAT(tags.tagName) AS tags
            FROM Transactions t
            JOIN Users u ON t.userID = u.userID
            LEFT JOIN Categories c ON t.categoryID = c.categoryID
            LEFT JOIN TransactionTags tt ON t.transactionID = tt.transactionID
            LEFT JOIN Tags tags ON tt.tagID = tags.tagID
            GROUP BY t.transactionID;
        `;
    }

    db.pool.query(filterQuery, function (error, rows) {
        if (error) {
            console.error('Error fetching filtered transactions:', error);
            return res.status(500).send("Error filtering transactions.");
        }

        res.json(rows);
    });
});


router.post('/add', function (req, res) {
    console.log('CREATE request received:', req.body);

    const { userID, categoryID, amount, date, description, tags } = req.body;

    // Validate required fields
    if (!userID || !categoryID || !amount || !date) {
        return res.status(400).send("Missing required fields.");
    }

    // Insert the new transaction into the Transactions table
    const query1 = `
        INSERT INTO Transactions (userID, categoryID, amount, date, description) 
        VALUES (${userID}, ${categoryID}, ${amount}, '${date}', '${description}');
    `;

    db.pool.query(query1, function (error, result) {
        if (error) {
            console.error('Error inserting transaction:', error);
            return res.status(500).send("Error inserting transaction.");
        }

        const transactionID = result.insertId;

        // Insert each tag individually
        if (tags && tags.length > 0) {
            tags.forEach(tagID => {
                const query2 = `
                    INSERT INTO TransactionTags (transactionID, tagID) 
                    VALUES (${transactionID}, ${tagID});
                `;
                db.pool.query(query2, function (error) {
                    if (error) {
                        console.error(`Error inserting into TransactionTags: transactionID=${transactionID}, tagID=${tagID}`);
                    }
                });
            });
        }

        // Fetch and respond with the newly added transaction
        fetchTransactionWithTags(transactionID, res);
    });
});


// Fetch a transaction with tags
function fetchTransactionWithTags(transactionID, res) {
    const query = `
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
    JOIN Categories ON Transactions.categoryID = Categories.categoryID
    LEFT JOIN TransactionTags ON Transactions.transactionID = TransactionTags.transactionID
    LEFT JOIN Tags ON TransactionTags.tagID = Tags.tagID
    WHERE Transactions.transactionID = ${transactionID}
    GROUP BY Transactions.transactionID;
`;

    db.pool.query(query, function (error, rows) {
        if (error) {
            console.error('Error fetching transaction:', error);
            return res.status(500).send("Error fetching transaction.");
        }

        const transaction = rows[0];
        if (transaction) {
            // Convert tags to an array or empty array if null
            transaction.tags = transaction.tags ? transaction.tags.split(",") : [];
        }

        console.log('Newly added transaction:', transaction);
        res.status(200).json(transaction); // Send the transaction back as JSON
    });
}

module.exports = router;
