/* Code citation
Date: 11/20/2024
Adapted: Event Listener setup from startercode
From: cs340-nodejs-starter-app, MDN web docs on textcontext
*/

console.log("select_transactionTags.js loaded");

// Select the dropdown and table body
const transactionFilter = document.getElementById("transactionFilter");
const tableBody = document.querySelector("#transactiontags tbody");

// Event listener for dropdown change
transactionFilter.addEventListener("change", (e) => {
    const selectedTransactionID = e.target.value;

    // Determine the URL to fetch data
    let url;
    if (selectedTransactionID) {
        // Fetch data for the selected transaction ID
        url = `/transactiontags/filter?transactionID=${selectedTransactionID}`;
        console.log(`Fetching data for transaction ID: ${selectedTransactionID}`);
    } else {
        // Fetch all transactions
        url = '/transactiontags/filter';
        console.log("Fetching all transactions...");
    }

    // Fetch data from the server
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            updateTable(data);
        })
        .catch(function (error) {
            console.error("Error fetching data:", error);
        });
});

// Function to update the table with new data
function updateTable(data) {
    tableBody.innerHTML = ""; // Clear the existing table rows

    data.forEach(row => {
        const newRow = document.createElement("tr");

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
                <button class="update-btn" data-id="${row.transactionID}">Update</button>
            </td>
        `;

        // Append the new row to the table body
        tableBody.appendChild(newRow);

        // Attach delete event listener for the new row
        const deleteButton = newRow.querySelector(".delete-btn");
        deleteButton.addEventListener("click", handleDelete);
    });
}

// Function to handle delete button clicks
function handleDelete(e) {
    e.preventDefault();

    const transactionID = e.target.dataset.transactionId;
    const tagID = e.target.dataset.tagId;

    console.log(`Deleting transactionID: ${transactionID}, tagID: ${tagID}`);

    fetch('/transactiontags/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionID, tagID }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete transaction tag');
            }
            return response.json();
        })
        .then(() => {
            console.log(`Deleted transactionID: ${transactionID}, tagID: ${tagID}`);
            e.target.closest("tr").remove();
        })
        .catch(error => console.error('Error:', error));
}
