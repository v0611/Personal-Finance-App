/* Code citation
Date: 11/20/2024
Adapted: Event Listener setup from startercode
From: cs340-nodejs-starter-app, MDN web docs on textcontext
*/

console.log("add_transactionTags.js loaded");

// Initialize an empty tagsList (populate drop down dynamically for newly added record)
let tagsList = [];

// Fetch tags from the backend
fetch('/transactiontags/tags')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch tags.');
        }
        return response.json();
    })
    .then(tags => {
        tagsList = tags.map(tag => ({ id: tag.id, tagName: tag.tagName }));
        console.log('Fetched tags:', tagsList);
    })
    .catch(error => console.error('Error fetching tags:', error));

// Get the form element
let addTransactionTagsForm = document.getElementById('add-new-transactiontag');

addTransactionTagsForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent page reload

    let inputTransaction = document.getElementById("transactionID");
    let inputTag = document.getElementById("tagID");

    let data = {
        transactionID: inputTransaction.value,
        tagID: inputTag.value,
    };

    console.log('Data being sent:', data);

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
        .then(newRows => {
            console.log('Server response:', newRows);

            // Dynamically add the newly created record to the table
            newRows.forEach(row => addNewTagRow(row, tagsList));

            // Clear form
            inputTransaction.value = '';
            inputTag.value = '';
        })
        .catch(error => console.error('Error:', error));
});

// Function to dynamically add a new row to the table
function addNewTagRow(row, tags) {
    let tableBody = document.querySelector("#transactiontags tbody");

    let newRow = document.createElement("tr");
    newRow.setAttribute("data-value", row.transactionID);

    newRow.innerHTML = `
        <td>${row.transactionID}</td>
        <td>${row.description}</td>
        <td>${row.tagName}</td>
        <td>
            <button class="delete-btn" data-transaction-id="${row.transactionID}" data-tag-id="${row.tagID}">
                Delete
            </button>
        </td>
        <td>
            <select class="update-dropdown">
                <option value="" selected>Select a Tag</option>
                ${tags.map(tag => `<option value="${tag.id}">${tag.tagName}</option>`).join('')}
            </select>
            <button class="update-btn" data-id="${row.transactionID}" data-tag-id="${row.tagID}">Update</button>
        </td>
    `;

    // Append the new row to the table body
    tableBody.appendChild(newRow);

    // Attach a delete event listener to the newly added delete button
    const deleteButton = newRow.querySelector(".delete-btn");
    deleteButton.addEventListener("click", handleDelete);

    // Attach an update event listener to the newly added update button
    const updateButton = newRow.querySelector(".update-btn");
    updateButton.addEventListener("click", handleUpdate);
}
