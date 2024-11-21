/* Code citation
Date: 11/20/2024
Adapted: Event Listener setup from startercode
From: cs340-nodejs-starter-app, MDN web docs on textcontext
*/

console.log("add_transactionTags.js loaded");
console.log("delete_transactionTags.js loaded");

// Select all delete buttons
let deleteTransactionTagsButtons = document.querySelectorAll('.delete-btn');

// event listeners to each button
deleteTransactionTagsButtons.forEach(button => {
    button.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent default form or button behavior


        let transactionID = e.target.dataset.id;
        console.log('Transaction ID being deleted:', transactionID);

        fetch('/transactionTags/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transactionID }),
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