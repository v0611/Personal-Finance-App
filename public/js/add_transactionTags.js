console.log("add_transactionTags.js loaded");
let addTransactionTagsForm = document.getElementById('add-new-transactiontag');

addTransactionTagsForm.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Form submitted event captured");

    let inputTransaction = document.getElementById("transactionID");
    let inputTag = document.getElementById("tagID");

    let data = {
        transactionID: inputTransaction.value,
        tagID: inputTag.value,
    };

    fetch('/transactiontags/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(updatedData => {
        console.log('Updated Data:', updatedData);

        // Update the DOM dynamically
        updateTable(updatedData);

        // Clear the form fields
        inputTransaction.value = '';
        inputTag.value = '';
    })
    .catch(error => console.error('Error:', error));
});

// Function to update the table dynamically
function updateTable(data) {
    let tableBody = document.querySelector("#transactiontags tbody");
    tableBody.innerHTML = ''; // Clear the table body

    // Loop through the updated data and add rows
    data.forEach(row => {
        let newRow = document.createElement("tr");
        newRow.setAttribute("data-value", row.transactionID);

        newRow.innerHTML = `
            <td>${row.transactionID}</td>
            <td>${row.description}</td>
            <td>${row.tags}</td>
        `;

        tableBody.appendChild(newRow);
    });
}
