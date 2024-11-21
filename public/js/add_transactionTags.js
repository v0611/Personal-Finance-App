/* Code citation
Date: 11/20/2024
Adapted: Event Listener setup from startercode, dynamically updating DOM only for affected row from MDN doc
From: cs340-nodejs-starter-app, MDN web docs on textcontext
*/

console.log("add_transactionTags.js loaded");

let addTransactionTagsForm = document.getElementById('add-new-transactiontag');

addTransactionTagsForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let inputTransaction = document.getElementById("transactionID");
    let inputTag = document.getElementById("tagID");

    let data = {
        transactionID: inputTransaction.value,
        tagID: inputTag.value,
    };

    // Sends a POST request to the /transactiontags/add endpoint
    fetch('/transactiontags/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with failure: ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(updatedData => {
            console.log('Updated Data:', updatedData);

            // Update only the specific row in the table
            updateAffectedRow(updatedData);

            // Clear the form fields
            inputTransaction.value = '';
            inputTag.value = '';
        })
        .catch(error => console.error('Error:', error));
});

// Function to update the table dynamically
function updateAffectedRow(data) {
    data.forEach(row => {
        // Get the affected row 
        let affectedRow = document.querySelector(`tr[data-value="${row.transactionID}"]`);
        if (affectedRow) {
            // Update the tags column only (third column)
            let tagsCell = affectedRow.querySelector("td:nth-child(3)");
            tagsCell.textContent = row.tags; // represents the text inside an element
        }
    });
}
