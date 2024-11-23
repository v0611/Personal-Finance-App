/* Code citation
Date: 11/21/2024
Adapted: Dynamically Updating Data
From: cs340-nodejs-starter-app
*/

console.log("update_transactionTags.js loaded");

// Select all update buttons
let updateTransactionTagsButtons = document.querySelectorAll('.update-btn');

// event listeners to each button
updateTransactionTagsButtons.forEach(button => {
    button.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent default form or button behavior

        let transactionID = e.target.dataset.id;
        let tagID = e.target.parentElement.parentElement.children[4].children[0].value;
        let oldTagID = e.target.dataset.tagId;
        console.log(`Data being sent in Update route TransID ${transactionID}, TagID: ${tagID}`)

        fetch('/transactionTags/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transactionID, tagID, oldTagID }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update transaction');
                }
                return response.json();
            })
            .then(() => {
                console.log(`Transaction ID ${transactionID} updated successfully.`);

                // TODO: Update the name of the tag displayed in the table
                // e.target.parent.parent.children[2].textContent = ;
            })
            .catch(error => console.error('Error:', error));
    });
});