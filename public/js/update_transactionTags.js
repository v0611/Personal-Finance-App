/* Code citation
Date: 11/21/2024
Adapted: Dynamically Updating Data
From: cs340-nodejs-starter-app
*/

console.log("add_transactionTags.js loaded");
console.log("delete_transactionTags.js loaded");
console.log("update_transactionTags.js loaded");

// Get the objects we need to modify
let updateTagForm = document.getElementById('update-new-transactiontag');

// Modify the objects we need
updateTagForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTransaction = document.getElementById("update-transactionID");
    let inputTag = document.getElementById("update-tagID");

    // Get the values from the form fields
    let Transaction = inputTransaction.value;
    let Tag = inputTag.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    // Don't know if this applies...
    // if (isNaN(homeworldValue)) 
    // {
    //     return;
    // }


    // Put our data we want to send in a javascript object
    let data = {
        transaction: Transaction,
        tag: Tag,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-transaction-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, Transaction);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, transactionID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("update-new-transactiontag");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == transactionID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}