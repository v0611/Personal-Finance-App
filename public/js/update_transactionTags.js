/* Code citation
Date: 11/21/2024
Adapted: Dynamically Updating Data
From: cs340-nodejs-starter-app
*/

console.log("update_transactionTags.js loaded");

// Select the table body (parent element)
const updateTableBody = document.querySelector("#transactiontags tbody");

// Event delegation for update and delete buttons
updateTableBody.addEventListener("click", (e) => {
    // Handle update button clicks
    if (e.target.classList.contains("update-btn")) {
        e.preventDefault();

        let transactionID = e.target.dataset.id;
        let oldTagID = e.target.dataset.tagId;
        let tagID = e.target.parentElement.parentElement.children[4].children[0].value;

        console.log(`Data being sent in Update route TransID ${transactionID}, TagID: ${tagID}`);

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
            .then(updatedRecord => {
                console.log(`Transaction ID ${transactionID} updated successfully.`);
// <<<<<<< merge-conflict
        
                // Fetch the updated tag name from the /tags endpoint
                return fetch('/tags')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch tags');
                        }
                        return response.json();
                    })
                    .then(tags => {
                        // Find the tag name corresponding to the updated tagID
                        const updatedTag = tags.find(tag => tag.id === parseInt(tagID));
                        if (updatedTag) {
                            // Update the tag name in the table dynamically
                            const tagNameCell = e.target.closest('tr').children[2]; // Adjust index to match the Tag column
                            tagNameCell.textContent = updatedTag.tagName;
                        } else {
                            console.error('Updated tag not found in fetched tags.');
                        }
                    });
// =======

//                 // TODO: Update the name of the tag displayed in the table
//                 const row = e.target.closest("tr"); // Get the row containing the clicked button
//                 row.children[2].textContent = updatedRecord.tagName; // Assuming the 3rd column is the tag name
//                 console.log('Tag updated to:', updatedRecord.tagName);
// >>>>>>> main
            })
            .catch(error => console.error('Error:', error));
    }

    // Handle delete button clicks
    if (e.target.classList.contains("delete-btn")) {
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
                    throw new Error('Failed to delete transaction');
                }
                return response.json();
            })
            .then(() => {
                console.log(`Deleted transactionID: ${transactionID}, tagID: ${tagID}`);
                e.target.closest("tr").remove();
            })
            .catch(error => console.error('Error:', error));
    }
});
