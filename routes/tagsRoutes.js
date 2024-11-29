
/* Code citation
Date: 11/20/2024
Adapted: fetching data 
From: cs340-nodejs-starter-app
*/

const express = require('express');
const router = express.Router();
const db = require('../database/db-connector');

// GET /tags
router.get('/', function (req, res) {
    const tagsQuery = `
        SELECT 
            t.tagID,
            t.tagName
        FROM Tags t
        ORDER BY t.tagID ASC;
    `;

    // Fetch: all records in Tags (to populate dropdowns)
    db.pool.query(tagsQuery, (error, tagsRows) => {
        if (error) {
            console.error('Error executing query tags:', error);
            return res.status(500).send("Error retrieving tags.");
        }

        res.render('tags.hbs', {
            data: tagsRows, // Data for the table
        });
        console.log(tagsRows);

    });
});

// GET: Filter tags by tag ID
router.get('/filter', function (req, res) {
    const { tagID } = req.query;
    console.log(tagID);

    let filterQuery;

    // if there a tag ID then query only records with that ID
    if (tagID) {
        filterQuery = `
            SELECT 
                t.tagID,
                t.tagName
            FROM Tags t
            WHERE t.tagID = ${tagID};
        `;
    } else { // no tag ID then querying all records
        filterQuery = `
            SELECT * from Tags;
        `;
    }

    db.pool.query(filterQuery, function (error, rows) {
        if (error) {
            console.error('Error fetching filtered tags:', error);
            return res.status(500).send("Error filtering tags.");
        }

        res.json(rows);
    });
});


router.post('/add', function (req, res) {
    console.log('CREATE request received:', req.body)
    let data = req.body;

    // NULL check for tagName
    let tagName = data.tagName;
    console.log(data.tagName);
    if (tagName === '') {
      console.error('Error updating tags:', error);
      return res.status(500).send("Tag Name not provided.");
    }

    console.log('tagName:', tagName);

    // Insert the new tag into the tags table
    let query1 = `
        INSERT INTO Tags (tagName) 
        VALUES ('${tagName}');
    `;

    db.pool.query(query1, function (error, rows, fields) { // rows refers to the row created from query 1
        if (error) {
            console.error('Error inserting tag:', error);
            return res.sendStatus(400);
        }
        console.log(rows);
        console.log(fields);

        if (rows.length > 0) {
            console.log('Duplicate entry found');
            return res.status(409).json({ message: "Duplicate entry: This tag already exists." });
        }

        console.log('Insertion successful');

        const tagID = rows.insertId;

        // Fetch the newly added tag
        const query2 = `
            SELECT 
                t.tagID,
                t.tagName
            FROM Tags t
            WHERE t.tagID = ${tagID};
        `;

        db.pool.query(query2, function (error, rows) {
            if (error) {
                console.error('Error fetching updated tag:', error);
                return res.status(400).json({ error: "Error fetching updated tag" });
            }

            console.log('Newly added tag record:', rows);
            res.json(rows);
        });
    });
});


module.exports = router;
