/* Code citation
Date: 11/20/2024
Adapted: Event Listener setup from starter code
From: cs340-nodejs-starter-app, MDN web docs on textContent
*/

console.log("select_transactionTags.js loaded");

// Select the dropdown and table body
const transactionFilter = document.getElementById("transactionFilter");
const tableBody = document.querySelector("#transactiontags tbody");

// Extract tags data from the page
// const tagsList = Array.from(document.querySelectorAll('select[name="tagID"] option')).map(option => ({
//     id: option.value,
//     tagName: option.textContent,
// }));

console.log('Tags list extracted from the page:', tagsList);

// Event listener for dropdown change
transactionFilter.addEventListener("change", (e) => {
    const selectedTransactionID = e.target.value;

    // Determine the URL to fetch data
    const url = selectedTransactionID
        ? `/transactiontags/filter?transactionID=${selectedTransactionID}`
        : '/transactiontags/filter';

    console.log(`Fetching data from URL: ${url}`);

    // Fetch data from the server
    fetch(url)
        .then((response) => response.json())
        .then((data) => updateTable(data, tagsList))
        .catch((error) => console.error("Error fetching data:", error));
});

// Function to update the table with new data
function updateTable(data, tags) {
    updateTableBody.innerHTML = ""; // Clear the existing table rows

    data.forEach((row) => {
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
                <select class="update-dropdown">
                    <option value="">Select a Tag</option>
                    ${tags
                .map(
                    (tag) =>
                        `<option value="${tag.id}" ${tag.id === row.tagID ? 'selected' : ''
                        }>${tag.tagName}</option>`
                )
                .join('')}
                </select>
                <button class="update-btn" data-id="${row.transactionID}" data-tag-id="${row.tagID}">Update</button>
            </td>
        `;

        // Append the new row to the table body
        updateTableBody.appendChild(newRow);
    });
}

// Event delegation for delete and update buttons
updateTableBody.addEventListener("click", (e) => {
    // Handle delete button clicks
    if (e.target.classList.contains("delete-btn")) {
        handleDelete(e);
    }

    // Handle update button clicks
    if (e.target.classList.contains("update-btn")) {
        handleUpdate(e);
    }
});

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
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to delete transaction tag');
            }
            return response.json();
        })
        .then(() => {
            console.log(`Deleted transactionID: ${transactionID}, tagID: ${tagID}`);
            e.target.closest("tr").remove();
        })
        .catch((error) => console.error('Error:', error));
}

// Function to handle update button clicks
function handleUpdate(e) {
    e.preventDefault();

    const transactionID = e.target.dataset.id;
    const oldTagID = e.target.dataset.tagId;
    const newTagID = e.target.parentElement.querySelector('.update-dropdown').value;

    if (!newTagID) {
        alert("Please select a tag to update.");
        return;
    }

    console.log(`Updating transactionID: ${transactionID}, oldTagID: ${oldTagID}, newTagID: ${newTagID}`);

    fetch('/transactiontags/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionID, tagID: newTagID, oldTagID }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to update transaction tag');
            }
            return response.json();
        })
        .then((updatedRow) => {
            console.log('Updated row:', updatedRow);

            // Update the row in the table dynamically
            const rowToUpdate = e.target.closest('tr');
            rowToUpdate.querySelector('td:nth-child(3)').textContent = updatedRow.tagName;

            // Update the dataset to reflect the new tagID
            e.target.dataset.tagId = updatedRow.tagID;

            alert('Transaction tag updated successfully.');
        })
        .catch((error) => console.error('Error:', error));
}
