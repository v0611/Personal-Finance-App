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
    console.log('Data being sent:', data)

    // Send a POST request to the /transactiontags/add endpoint
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
            console.log('Server response:', updatedData);

            // Update the table with the newly added record
            addNewTagRow(updatedData);

            // Clear the form fields
            inputTransaction.value = '';
            inputTag.value = '';
        })
        .catch(error => console.error('Error:', error));
});

// Function to add a new row to the table
function addNewTagRow(data) {
    data.forEach(row => {
        // Find the table body
        let tableBody = document.querySelector("#transactiontags tbody");

        // Create a new row
        let newRow = document.createElement("tr");
        newRow.setAttribute("data-value", row.transactionID);

        // Populate the new row with data
        newRow.innerHTML = `
            <td>${row.transactionID}</td>
            <td>${row.description}</td>
            <td>${row.tagName}</td>
            <td><button class="delete-btn" data-id="${row.transactionID}">Delete</button></td>
            <td><button class="update-btn" data-id="${row.transactionID}">Update</button></td>
        `;

        // Append the new row to the table
        tableBody.appendChild(newRow);
    });
}
