/* Code citation
Date: 11/20/2024
Adapted: Event Listener setup from startercode
From: cs340-nodejs-starter-app, Dynamically Updating Data
*/

console.log("delete_transactionTags.js loaded");

// Select all delete buttons
let updateTransactionTagsButtons = document.querySelectorAll('.update-btn');

// event listeners to each button
updateTransactionTagsButtons.forEach(button => {
    button.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent default form or button behavior

        let transactionID = e.target.dataset.transactionId;
        let tagID = e.target.dataset.tagId;
        console.log(`Data being sent in Delete route TransID ${transactionID}, TagID: ${tagID}`)

        fetch('/transactionTags/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transactionID, tagID }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete transaction');
                }
                return response.json();
            })
            .then(() => {
                console.log(`Transaction ID ${transactionID} deleted successfully.`);

                // Remove the corresponding row from the table
                e.target.closest("tr").remove();
            })
            .catch(error => console.error('Error:', error));
    });
});