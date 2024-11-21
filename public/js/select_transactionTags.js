console.log("select_transactionTags.js loaded");

// Select the dropdown and table body
const transactionFilter = document.getElementById("transactionFilter");
const tableBody = document.querySelector("#transactiontags tbody");

if (transactionFilter && tableBody) {
    // Event listener for dropdown change
    transactionFilter.addEventListener("change", (e) => {
        const selectedTransactionID = e.target.value;

        if (!selectedTransactionID) {
            // If "All Transactions" is selected, fetch all rows
            console.log("Fetching all transactions...");
            fetch('/transactiontags')
                .then(response => response.json())
                .then(data => updateTable(data))
                .catch(error => console.error('Error fetching all transactions:', error));
            return;
        }

        console.log('Selected transactionID:', selectedTransactionID);

        // Fetch records for the selected transactionID
        fetch(`/transactiontags/${selectedTransactionID}`)
            .then(response => response.json())
            .then(data => updateTable(data))
            .catch(error => console.error('Error fetching data:', error));
    });

    // Function to update the table with new data
    function updateTable(data) {
        // Clear the existing table rows
        tableBody.innerHTML = "";

        // Populate the table with the new rows
        data.forEach(row => {
            const newRow = document.createElement("tr");
            newRow.setAttribute("data-transaction-id", row.transactionID);

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

            tableBody.appendChild(newRow);
        });
    }
} else {
    console.error("Required DOM elements not found: transactionFilter or tableBody");
}
