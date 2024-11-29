
/* Code citation
Date: 11/20/2024
Adapted: fetching data 
From: cs340-nodejs-starter-app
*/

const express = require('express');
const router = express.Router();
const db = require('../database/db-connector');

// GET /categories
router.get('/', function (req, res) {
    const categoriesQuery = `
        SELECT 
            c.categoryID,
            c.categoryName,
            c.categoryType
        FROM Categories c
    `;

    // Fetch: all records in Categories (to populate dropdowns)
    db.pool.query(categoriesQuery, (error, categoriesRows) => {
        if (error) {
            console.error('Error executing query for categories:', error);
            return res.status(500).send("Error retrieving categories.");
        }

        res.render('categories.hbs', {
            data: categoriesRows, // Data for the table
        });
        console.log(categoriesRows);

    });
});

// GET: Filter categories by Category ID
router.get('/filter', function (req, res) {
    const { categoryID } = req.query;

    let filterQuery;

    // if there is a category ID then query only records with that ID
    if (categoryID) {
        filterQuery = `
            SELECT 
                c.categoryID,
                c.categoryName,
                c.categoryType
            FROM Categories c
            WHERE c.categoryID = ${categoryID};
        `;
    } else { // no category ID then querying all records
        filterQuery = `
            SELECT * from Categories
        `;
    }

    db.pool.query(filterQuery, function (error, rows) {
        if (error) {
            console.error('Error fetching filtered categories:', error);
            return res.status(500).send("Error filtering categories.");
        }

        res.json(rows);
    });
});


router.post('/add', function (req, res) {
    console.log('CREATE request received:', req.body)
    let data = req.body;

    // NULL check for categoryName, categoryType 
    let categoryName = data.categoryName;
    console.log(data.categoryName);
    if (categoryName === '') {
      console.error('Error updating categories:', error);
      return res.status(500).send("Category Name not provided.");
    }

    let categoryType = data.categoryType;
    console.log(data.categoryType);
    if (categoryType == '') {
      console.error('Error updating categories:', error);
      return res.status(500).send("Email not provided.");
    }

    console.log('categoryName:', categoryName);
    console.log('categoryType:', categoryType);


    // Insert the new category into the Categories table
    let query1 = `
        INSERT INTO Categories (categoryName, categoryType) 
        VALUES ('${categoryName}', '${categoryType}');
    `;

    db.pool.query(query1, function (error, rows, fields) { // rows refers to the row created from query 1
        if (error) {
            console.error('Error inserting category:', error);
            return res.sendStatus(400);
        }
        console.log(rows);
        console.log(fields);

        if (rows.length > 0) {
            console.log('Duplicate entry found');
            return res.status(409).json({ message: "Duplicate entry: This category already exists." });
        }

        console.log('Insertion successful');

        const categoryID = rows.insertId;

        // Fetch the newly added category
        const query2 = `
            SELECT 
                c.categoryID,
                c.categoryName,
                c.categoryType
            FROM Categories c
            WHERE c.categoryID = ${categoryID};
        `;

        db.pool.query(query2, function (error, rows) {
            if (error) {
                console.error('Error fetching updated category:', error);
                return res.status(400).json({ error: "Error fetching updated category" });
            }

            console.log('Newly added category record:', rows);
            res.json(rows);
        });
    });
});

router.get('/types', function (req, res) {

    const typesQuery = `
        SELECT DISTINCT
            c.categoryType
        from Categories c
    `;

    db.pool.query(typesQuery, function (error, rows, fields) {
        if(error) {
            console.error("Error retrieving Category Types", error);
            return res.status(400).json({error: "Error retrieving Category Types"})
        }
    console.log(rows);
    console.log(fields);
    
    res.json(rows);
    });
    
    

});


module.exports = router;
