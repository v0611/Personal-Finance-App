
/* Code citation
Date: 11/20/2024
Adapted: fetching data 
From: cs340-nodejs-starter-app
*/

const express = require('express');
const router = express.Router();
const db = require('../database/db-connector');

// GET /users
router.get('/', function (req, res) {
    const usersQuery = `
        SELECT 
            u.userID,
            u.userName,
            u.userEmail,
            u.password
        FROM Users u
    `;

    // const transactionsQuery = `
    //     SELECT transactionID AS id, description
    //     FROM Transactions;
    // `;

    // const tagsQuery = `
    //     SELECT tagID AS id, tagName
    //     FROM Tags;
    // `;

    // Fetch: all records in TransactionTags, Transactions and Tags (to populate dropdowns)
    db.pool.query(usersQuery, (error, usersRows) => {
        if (error) {
            console.error('Error executing query for users:', error);
            return res.status(500).send("Error retrieving users.");
        }

        // db.pool.query(transactionsQuery, (error, transactionRows) => {
        //     if (error) {
        //         console.error('Error fetching transactions:', error);
        //         return res.status(500).send("Error fetching transactions.");
        //     }

        //     db.pool.query(tagsQuery, (error, tagRows) => {
        //         if (error) {
        //             console.error('Error fetching tags:', error);
        //             return res.status(500).send("Error fetching tags.");
        //         }

        res.render('users.hbs', {
            data: usersRows, // Data for the table
            // transactions: transactionRows, // Data for transaction dropdown
            // tags: tagRows, // Data for tag dropdown
        });
        console.log(usersRows)
        //     });
        // });
    });
});

// GET: Filter users by User ID
router.get('/filter', function (req, res) {
    const { userID } = req.query;

    let filterQuery;

    // if there a transaction ID then query only records with that ID
    if (userID) {
        filterQuery = `
            SELECT 
                u.userID,
                u.userName,
                u.userEmail,
                u.password
            FROM Users u
            WHERE u.userID = ${userID};
        `;
    } else { // no transaction ID then querying all records
        filterQuery = `
            SELECT * from Users
        `;
    }

    db.pool.query(filterQuery, function (error, rows) {
        if (error) {
            console.error('Error fetching filtered users:', error);
            return res.status(500).send("Error filtering users.");
        }

        res.json(rows);
    });
});


router.post('/add', function (req, res) {
    console.log('CREATE request received:', req.body)
    let data = req.body;

    // NULL check for userName, userEmail and password
    let userName = data.userName;
    console.log(data.userName);
    if (userName === '') {
      console.error('Error updating users:', error);
      return res.status(500).send("User Name not provided.");
    }

    let userEmail = data.userEmail;
    console.log(data.userEmail);
    if (userEmail == '') {
      console.error('Error updating users:', error);
      return res.status(500).send("Email not provided.");
    }

    let password = data.userPassword;
    console.log(data.userPassword);
    if (password == '') {
      console.error('Error updating users:', error);
      return res.status(500).send("Password not provided.");
    }

    console.log('userName:', userName);
    console.log('userEmail:', userEmail);
    console.log('Password:', password);

    // Insert the new user into the Users table
    let query1 = `
        INSERT INTO Users (userName, userEmail, password) 
        VALUES ('${userName}', '${userEmail}', '${password}');
    `;

    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.error('Error inserting user:', error);
            return res.sendStatus(400);
        }

        if (rows.length > 0) {
            console.log('Duplicate entry found');
            return res.status(409).json({ message: "Duplicate entry: This user already exists." });
        }

        console.log('Insertion successful');

        // Fetch the newly added user
        const query2 = `
            SELECT 
                u.userID,
                u.userName,
                u.userEmail,
                u.password
            FROM Users u
            WHERE u.userID = LAST_INSERT_ID();
        `;

        db.pool.query(query2, function (error, rows) {
            if (error) {
                console.error('Error fetching updated user:', error);
                return res.status(400).json({ error: "Error fetching updated user" });
            }

            console.log('Newly added user record:', rows);
            res.json(rows);
        });
    });
});


// // DELETE /transactionTags/delete
// router.delete('/delete', function (req, res) {
//     console.log('DELETE request receive:', req.body)
//     let transactionID = req.body.transactionID;
//     let tagID = req.body.tagID;
//     console.log('delete route trans ID & tag ID: ', transactionID, tagID)

//     const deleteQuery = `
//         DELETE FROM TransactionTags 
//         WHERE transactionID = ${transactionID} AND tagID = ${tagID};
//     `;

//     db.pool.query(deleteQuery, function (error, results) {
//         if (error) {
//             console.error('Error deleting transaction tag:', error);
//             return res.status(500).json({ error: 'Failed to delete transaction tag.' });
//         }

//         console.log(`Transaction tag with ID ${transactionID} deleted successfully.`);
//         res.status(200).json({ message: 'Transaction tag deleted successfully.' });
//     });
// });

// // UPDATE /transactionTags/update
// router.put('/update', function (req, res) {
//     let transactionID = req.body.transactionID;
//     console.log(req.body);
//     let tagID = req.body.tagID;
//     let oldTagID = req.body.oldTagID;
//     console.log('update route: ', transactionID);

//     // Check if transactionID is valid
//     if (!transactionID) {
//         console.error('Transaction ID is missing.');
//         return res.status(400).json({ error: 'Transaction ID is required.' });
//     }

//     const updateQuery = `
//         UPDATE TransactionTags 
//         SET tagID = ${tagID}
//         WHERE transactionID = ${transactionID} and tagID = ${oldTagID};
//     `;

//     db.pool.query(updateQuery, function (error, results) {
//         if (error) {
//             console.error('Error updating transaction tag:', error);
//             return res.status(500).json({ error: 'Failed to update transaction tag.' });
//         }

//         if (results.affectedRows === 0) {
//             console.warn('No matching record with given ID.');
//             return res.status(404).json({ error: 'Transaction tag record not found.' });
//         }

//         console.log(`Transaction tag with ID ${transactionID} updated successfully.`);
//         res.status(200).json({ message: 'Transaction tag updated successfully.' });
//     });
// });

module.exports = router;
