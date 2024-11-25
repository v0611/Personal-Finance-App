/* Code citation
Date: 11/20/2024
Adapted: Event Listener setup from startercode, createElement(), appendChild() from MDN
From: cs340-nodejs-starter-app, MDN web docs on textcontext
*/

console.log("add_transaction.js loaded");

document.getElementById("add-transaction-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get form values
    const userID = document.getElementById("user-name").value;
    const categoryID = document.getElementById("category").value;
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;

    // Collect selected tags
    const tags = Array.from(document.querySelectorAll('input[name="tags"]:checked')).map(checkbox => checkbox.value);

    // Prepare data to send
    const data = {
        userID: parseInt(userID),
        categoryID: parseInt(categoryID),
        amount: parseFloat(amount),
        description: description.trim(),
        date: date.trim(),
        tags: tags.map(tag => parseInt(tag))
    };

    // Send data to the backend
    fetch("/transactions/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }
            return response.json();
        })
        .then(newTransaction => {
            // Log the new transaction and update the table dynamically
            console.log("Transaction added:", newTransaction);
            addNewTransactionRow(newTransaction); // Update the table
            this.reset(); // Clear the form
        })
        .catch(error => {
            console.error("Error adding transaction:", error);
            alert("Failed to add the transaction. Please try again.");
        });
});


function addNewTransactionRow(transaction) {
    const tableBody = document.querySelector("#transactions-table tbody");

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${transaction.transactionID}</td>
        <td>${transaction.userName}</td>
        <td>${transaction.categoryName}</td>
        <td>${transaction.categoryType}</td>
        <td>${transaction.amount.toFixed(2)}</td>
        <td>${transaction.formatted_date}</td>
        <td>${transaction.description}</td>
        <td>${transaction.tags && Array.isArray(transaction.tags) ? transaction.tags.join(", ") : ""}</td>
    `;

    tableBody.appendChild(newRow);
}



