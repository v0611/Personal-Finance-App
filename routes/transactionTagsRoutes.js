
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
    console.log('CREATE request received:', req.body)
    let data = req.body;

    // NULL check for transactionID and tagID
    let transactionID = parseInt(data.transactionID);
    if (isNaN(transactionID)) {
        transactionID = 'NULL';
    }

    let tagID = parseInt(data.tagID);
    if (isNaN(tagID)) {
        tagID = 'NULL';
    }

    console.log('Trans ID:', transactionID);
    console.log('Tag ID:', tagID);

    // Insert the new tag into the TransactionTags table
    let query1 = `
        INSERT INTO TransactionTags (transactionID, tagID) 
        VALUES (${transactionID}, ${tagID});
    `;

    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.error('Error inserting transaction tag:', error);
            return res.sendStatus(400);
        }

        if (rows.length > 0) {
            console.log('Duplicate entry found');
            return res.status(409).json({ message: "Duplicate entry: This transaction and tag combination already exists." });
        }

        console.log('Insertion successful');

        // Fetch the newly added transaction tag
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
                console.error('Error fetching updated transaction tag:', error);
                return res.status(400).json({ error: "Error fetching updated transaction tag" });
            }

            console.log('Newly added tag record:', rows);
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
    let transactionID = req.body.transactionID;
    console.log('update route: ', transactionID)

    // Check if transactionID is valid
    if (!transactionID) {
        console.error('Transaction ID is missing.');
        return res.status(400).json({ error: 'Transaction ID is required.' });
    }

    const updateQuery = `
        UPDATE TransactionTags 
        SET transactionID = ${transactionID}, tagID = ${tagID};
    `;

    db.pool.query(updateQuery, function (error, results) {
        if (error) {
            console.error('Error updating transaction tag:', error);
            return res.status(500).json({ error: 'Failed to update transaction tag.' });
        }

        if (results.affectedRows === 0) {
            console.warn('No matching record with given ID.');
            return res.status(404).json({ error: 'Transaction tag record not found.' });
        }

        console.log(`Transaction tag with ID ${transactionID} updated successfully.`);
        res.status(200).json({ message: 'Transaction tag updated successfully.' });
    });
});

// UPDATE /transactionTags/update
router.put('/update', function (req, res) {
    let transactionID = req.body.transactionID;
    console.log(req.body);
    let tagID = req.body.tagID;
    let oldTagID = req.body.oldTagID;
    console.log('update route: ', transactionID);

    // Check if transactionID is valid
    if (!transactionID) {
        console.error('Transaction ID is missing.');
        return res.status(400).json({ error: 'Transaction ID is required.' });
    }

    const updateQuery = `
        UPDATE TransactionTags 
        SET tagID = ${tagID}
        WHERE transactionID = ${transactionID} and tagID = ${oldTagID};
    `;

    db.pool.query(updateQuery, function (error, results) {
        if (error) {
            console.error('Error updating transaction tag:', error);
            return res.status(500).json({ error: 'Failed to update transaction tag.' });
        }

        if (results.affectedRows === 0) {
            console.warn('No matching record with given ID.');
            return res.status(404).json({ error: 'Transaction tag record not found.' });
        }

        console.log(`Transaction tag with ID ${transactionID} updated successfully.`);
        res.status(200).json({ message: 'Transaction tag updated successfully.' });
    });
});

module.exports = router;
