/* Code citation
Date: 11/20/2024
Adapted: Event Listener setup from startercode
From: cs340-nodejs-starter-app, MDN web docs on textcontext
*/

console.log("select_users.js loaded");

// Select the dropdown and table body
const userFilter = document.getElementById("userFilter");
const tableBody = document.querySelector("#users tbody");

// Event listener for dropdown change
userFilter.addEventListener("change", (e) => {
    const selectedUserID = e.target.value;

    // Determine the URL to fetch data
    let url = selectedUserID
        ? `/users/filter?userID=${selectedUserID}`
        : '/users/filter';

    console.log(`Fetching data from: ${url}`); // Debugging

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched data:', data); // Debugging
            updateTable(data);
        })
        .catch(error => console.error("Error fetching data:", error));
});

// Function to update the table with new data
function updateTable(data) {
    tableBody.innerHTML = ""; // Clear the existing table rows
    if (!data || data.length === 0) {
      console.warn("No data received to populate the table.");
      return;
    }

    data.forEach(row => {
        const newRow = document.createElement("tr");

        newRow.innerHTML = `
            <td>${row.userID}</td>
            <td>${row.userName}</td>
            <td>${row.userEmail}</td>
            <td>${row.password}</td>
        `;

        // Append the new row to the table body
        tableBody.appendChild(newRow);

        // Attach delete event listener for the new row
        // const deleteButton = newRow.querySelector(".delete-btn");
        // deleteButton.addEventListener("click", handleDelete);
    });
}

// Function to handle delete button clicks
// function handleDelete(e) {
//     e.preventDefault();

//     const transactionID = e.target.dataset.transactionId;
//     const tagID = e.target.dataset.tagId;

//     console.log(`Deleting transactionID: ${transactionID}, tagID: ${tagID}`);

//     fetch('/transactiontags/delete', {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ transactionID, tagID }),
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Failed to delete transaction tag');
//             }
//             return response.json();
//         })
//         .then(() => {
//             console.log(`Deleted transactionID: ${transactionID}, tagID: ${tagID}`);
//             e.target.closest("tr").remove();
//         })
//         .catch(error => console.error('Error:', error));
// }