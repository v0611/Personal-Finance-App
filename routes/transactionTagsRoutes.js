/* Code citation
Date: 11/20/2024
Adapted: fetching data 
From: cs340-nodejs-starter-app
*/

const express = require('express');
const router = express.Router();
const db = require('../database/db-connector');

// GET /transactiontags
router.get('/', function (req, res) {
    const transactionTagsQuery = `
        SELECT 
            t.transactionID,
            t.description,
            GROUP_CONCAT(tg.tagName SEPARATOR ', ') AS tags
        FROM TransactionTags tt
        JOIN Transactions t ON tt.transactionID = t.transactionID
        JOIN Tags tg ON tt.tagID = tg.tagID
        GROUP BY t.transactionID, t.description
        ORDER BY t.transactionID;
    `;

    const transactionsQuery = `
        SELECT transactionID AS id, description
        FROM Transactions;
    `;

    const tagsQuery = `
        SELECT tagID AS id, tagName
        FROM Tags;
    `;

    // Fetch: all records in TransactionTags, Transactions and Tags (to populate dropdowns)
    db.pool.query(transactionTagsQuery, (error, transactionTagsRows) => {
        if (error) {
            console.error('Error executing query for transaction tags:', error);
            return res.status(500).send("Error retrieving transaction tags.");
        }

        db.pool.query(transactionsQuery, (error, transactionRows) => {
            if (error) {
                console.error('Error fetching transactions:', error);
                return res.status(500).send("Error fetching transactions.");
            }

            db.pool.query(tagsQuery, (error, tagRows) => {
                if (error) {
                    console.error('Error fetching tags:', error);
                    return res.status(500).send("Error fetching tags.");
                }

                res.render('transactionTags.hbs', {
                    data: transactionTagsRows, // Data for the table
                    transactions: transactionRows, // Data for transaction dropdown
                    tags: tagRows, // Data for tag dropdown
                });
            });
        });
    });
});

router.post('/add', function (req, res) {
    // Capture the incoming data
    let data = req.body;

    // Capture and check for NULL values for transactionID and tagID
    let transactionID = parseInt(data.transactionID);
    if (isNaN(transactionID)) {
        transactionID = 'NULL';
    }

    let tagID = parseInt(data.tagID);
    if (isNaN(tagID)) {
        tagID = 'NULL';
    }
    console.log('Trans ID:', transactionID)
    console.log('Tag ID: ', tagID)

    let query1 = `
        INSERT INTO TransactionTags (transactionID, tagID) 
        VALUES (${transactionID}, ${tagID});
        `;

    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.error('Error inserting transaction tag:', error);
            return res.sendStatus(400); // Bad request
        }
        console.log('Insertion successful')

        // Insertion successful - Fetch the updated transaction tags
        const query2 = `
            SELECT 
            t.transactionID,
            t.description,
            GROUP_CONCAT(tg.tagName SEPARATOR ', ') AS tags
            FROM TransactionTags tt
            JOIN Transactions t ON tt.transactionID = t.transactionID
            JOIN Tags tg ON tt.tagID = tg.tagID
            GROUP BY t.transactionID, t.description
            ORDER BY t.transactionID;
        `;

        db.pool.query(query2, function (error, rows) {
            if (error) {
                console.error('Error fetching updated transaction tags:', error);
                return res.status(400).json({ error: "Error fetching updated transaction tags" });
            }
            console.log('Rows:', rows)
            res.json(rows);
        })
    })
})

// DELETE /transactionTags/delete
router.delete('/delete', function (req, res) {
    let transactionID = req.body.transactionID;
    console.log('delete route: ', transactionID)

    // Check if transactionID is valid
    if (!transactionID) {
        console.error('Transaction ID is missing.');
        return res.status(400).json({ error: 'Transaction ID is required.' });
    }

    const deleteQuery = `
        DELETE FROM TransactionTags 
        WHERE transactionID = ${transactionID};
    `;

    db.pool.query(deleteQuery, function (error, results) {
        if (error) {
            console.error('Error deleting transaction tag:', error);
            return res.status(500).json({ error: 'Failed to delete transaction tag.' });
        }

        if (results.affectedRows === 0) {
            console.warn('No matching record with given ID.');
            return res.status(404).json({ error: 'Transaction tag record not found.' });
        }

        console.log(`Transaction tag with ID ${transactionID} deleted successfully.`);
        res.status(200).json({ message: 'Transaction tag deleted successfully.' });
    });
});


module.exports = router;
