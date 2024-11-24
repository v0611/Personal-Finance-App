/* Code citation
Date: 11/20/2024
Adapted: Event Listener setup from startercode, createElement(), appendChild() from MDN
From: cs340-nodejs-starter-app, MDN web docs on textcontext
*/

console.log("add_transaction.js loaded");

const addTransactionForm = document.getElementById("add-transaction-form");

// Add event listener to handle form submission
addTransactionForm.addEventListener("submit", function (e) {
    e.preventDefault(); 

    // Get form values
    const userID = document.getElementById("user-name").value;
    const categoryID = document.getElementById("category").value;
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const tags = Array.from(document.getElementById("tags").selectedOptions).map(option => option.value);


    // Prepare data to send
    const data = {
        userID: parseInt(userID),
        categoryID: parseInt(categoryID),
        amount: parseFloat(amount),
        description: description.trim(),
        date: date.trim(),
        tags: tags.map(tag => parseInt(tag))
    };

    console.log("Data being sent:", data);

    // Send data to the server
    fetch("/transactions/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(newTransaction => {
            console.log("Server response:", newTransaction);

            // Add the new transaction to the table dynamically
            addNewTransactionRow(newTransaction);

            // Clear the form
            addTransactionForm.reset();
        })
        .catch(error => {
            console.error("Error adding transaction:", error);
            alert("Failed to add transaction. Please check your inputs and try again.");
        });
});

// Function to add a new transaction row to the table dynamically
function addNewTransactionRow(transaction) {
    const tableBody = document.querySelector("#transactions-table tbody");

    // Reformat date to mm/dd/yyyy
    const formattedDate = transaction.formatted_date || formatDate(transaction.date);

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${transaction.transactionID}</td>
        <td>${transaction.userName}</td>
        <td>${transaction.categoryName}</td>
        <td>${transaction.categoryType}</td>
        <td>${transaction.amount}</td>
        <td>${formattedDate}</td>
        <td>${transaction.description}</td>
        <td>${transaction.tags && Array.isArray(transaction.tags) ? transaction.tags.join(", ") : ""}</td>
    `;

    tableBody.appendChild(newRow);
}

// Function to format date to mm/dd/yyyy
function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
}

