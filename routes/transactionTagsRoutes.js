
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
            tg.tagID,
            tg.tagName
        FROM TransactionTags tt
        JOIN Transactions t ON tt.transactionID = t.transactionID
        JOIN Tags tg ON tt.tagID = tg.tagID
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
                console.log(transactionTagsRows)
            });
        });
    });
});

// GET: Filter transaction tags by transactionID
router.get('/filter', function (req, res) {
    const { transactionID } = req.query;

    let filterQuery;

    // if there a transaction ID then query only records with that ID
    if (transactionID) {
        filterQuery = `
            SELECT 
                t.transactionID,
                t.description,
                tg.tagID,
                tg.tagName
            FROM TransactionTags tt
            JOIN Transactions t ON tt.transactionID = t.transactionID
            JOIN Tags tg ON tt.tagID = tg.tagID
            WHERE t.transactionID = ${transactionID};
        `;
    } else { // no transaction ID then querying all records
        filterQuery = `
            SELECT 
                t.transactionID,
                t.description,
                tg.tagID,
                tg.tagName
            FROM TransactionTags tt
            JOIN Transactions t ON tt.transactionID = t.transactionID
            JOIN Tags tg ON tt.tagID = tg.tagID;
        `;
    }

    db.pool.query(filterQuery, function (error, rows) {
        if (error) {
            console.error('Error fetching filtered transaction tags:', error);
            return res.status(500).send("Error filtering transaction tags.");
        }

        res.json(rows);
    });
});


router.post('/add', function (req, res) {
    console.log('CREATE request received:', req.body);

    let transactionID = parseInt(req.body.transactionID);
    let tagID = parseInt(req.body.tagID);

    console.log('Trans ID:', transactionID);
    console.log('Tag ID:', tagID);

    const query1 = `
        INSERT INTO TransactionTags (transactionID, tagID) 
        VALUES (${transactionID}, ${tagID});
    `;

    db.pool.query(query1, function (error) {
        if (error) {
            console.error('Error inserting transaction tag:', error);
            return res.status(400).json({ error: 'Error inserting transaction tag.' });
        }

        // query all records to dynamically update the display table 
        const query2 = `
            SELECT 
                t.transactionID,
                t.description,
                tg.tagID,
                tg.tagName
            FROM TransactionTags tt
            JOIN Transactions t ON tt.transactionID = t.transactionID
            JOIN Tags tg ON tt.tagID = tg.tagID
            WHERE tt.transactionID = ${transactionID} AND tt.tagID = ${tagID};
        `;

        db.pool.query(query2, function (error, rows) {
            if (error) {
                console.error('Error fetching new transaction tag:', error);
                return res.status(400).json({ error: 'Error fetching new transaction tag.' });
            }

            res.json(rows);
        });
    });
});



// DELETE /transactionTags/delete
router.delete('/delete', function (req, res) {
    console.log('DELETE request receive:', req.body)
    let transactionID = req.body.transactionID;
    let tagID = req.body.tagID;
    console.log('delete route trans ID & tag ID: ', transactionID, tagID)

    const deleteQuery = `
        DELETE FROM TransactionTags 
        WHERE transactionID = ${transactionID} AND tagID = ${tagID};
    `;

    db.pool.query(deleteQuery, function (error, results) {
        if (error) {
            console.error('Error deleting transaction tag:', error);
            return res.status(500).json({ error: 'Failed to delete transaction tag.' });
        }

        console.log(`Transaction tag with ID ${transactionID} deleted successfully.`);
        res.status(200).json({ message: 'Transaction tag deleted successfully.' });
    });
});

// UPDATE /transactionTags/update
router.put('/update', function (req, res) {
    const { transactionID, tagID, oldTagID } = req.body;

    if (!transactionID || !tagID || !oldTagID) {
        return res.status(400).json({ error: 'Transaction ID, new tagID, and old tagID are required.' });
    }

    const updateQuery = `
        UPDATE TransactionTags 
        SET tagID = ${tagID}
        WHERE transactionID = ${transactionID} AND tagID = ${oldTagID};
    `;

    db.pool.query(updateQuery, function (error, results) {
        if (error) {
            return res.status(500).json({ error: 'Failed to update transaction tag.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Transaction tag record not found.' });
        }

        // Fetch and return the updated record
        const fetchQuery = `
            SELECT 
                t.transactionID,
                t.description,
                tg.tagID,
                tg.tagName
            FROM TransactionTags tt
            JOIN Transactions t ON tt.transactionID = t.transactionID
            JOIN Tags tg ON tt.tagID = tg.tagID
            WHERE tt.transactionID = ${transactionID} AND tt.tagID = ${tagID};
        `;

        db.pool.query(fetchQuery, function (fetchError, rows) {
            if (fetchError) {
                return res.status(500).json({ error: 'Failed to fetch updated record.' });
            }

            res.status(200).json(rows[0]); // Return the updated record
        });
    });
});

// Fetch all tags
router.get('/tags', function (req, res) {
    const query = `
        SELECT tagID AS id, tagName
        FROM Tags;
    `;

    db.pool.query(query, function (error, results) {
        if (error) {
            console.error('Error fetching tags:', error);
            res.status(500).send('Error fetching tags.');
        } else {
            res.json(results); // Send the tags as JSON
        }
    });
});


module.exports = router;
