/* Code citation
Date: 11/20/2024
Adapted: Event Listener setup from startercode, createElement(), appendChild() from MDN
From: cs340-nodejs-starter-app, MDN web docs on textcontext
*/

console.log("add_transactionTags.js loaded");

let addTransactionTagsForm = document.getElementById('add-new-transactiontag');

addTransactionTagsForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let inputTransaction = document.getElementById("transactionID");
    let inputTag = document.getElementById("tagID");

    // NULL check
    if (!inputTransaction.value) {
        alert("Please select a transaction.");
        return;
    }

    if (!inputTag.value) {
        alert("Please select a tag.");
        return;
    }

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
        .then(newRow => {
            console.log('Server response:', newRow);

            // add the newly created record to the table 
            addNewTagRow(newRow);

            // clear form 
            inputTransaction.value = '';
            inputTag.value = '';
        })
        .catch(error => console.error('Error:', error));
});

// Function to add a new row to the table
function addNewTagRow(data) {
    let tableBody = document.querySelector("#transactiontags tbody");

    data.forEach(row => {
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
                <button class="update-btn" data-id="${row.transactionID}">Update</button>
            </td>
        `;

        // Append the new row to the table body
        tableBody.appendChild(newRow);

        // Reattach delete event listeners for the newly added row
        // without, cant delete the newly created record without reloading page
        attachDeleteListeners(); 
    });
}

// Function to attach delete event listeners
function attachDeleteListeners() {
    let deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {
        // Remove previous event listener if it exists to prevent duplicate handlers
        button.removeEventListener("click", handleDelete);
        button.addEventListener("click", handleDelete);
    });
}

// Delete button event handler
function handleDelete(e) {
    e.preventDefault();

    let transactionID = e.target.dataset.transactionId;
    let tagID = e.target.dataset.tagId;

    console.log(`Attempting to delete: TransID ${transactionID}, TagID ${tagID}`);

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
            console.log(`Transaction ID ${transactionID} and Tag ID ${tagID} deleted successfully.`);
            e.target.closest("tr").remove();
        })
        .catch(error => console.error('Error:', error));
}

// Initial setup: attach delete listeners when the page loads
attachDeleteListeners();
