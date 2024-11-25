/* Code citation
Date: 11/20/2024
Adapted: Event Listener setup from starter code
From: cs340-nodejs-starter-app, MDN web docs on textContent
*/

// Add event listener for the filter dropdown
document.getElementById("transactionFilter").addEventListener("change", function () {
    const userID = this.value; // Get selected user ID
    const tableBody = document.querySelector("#transactions-table tbody");

    // Fetch transactions based on selected user
    fetch(`/transactions/filter?userID=${userID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching filtered transactions: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Clear existing rows in the table
            tableBody.innerHTML = "";

            // Populate the table with the filtered transactions
            data.forEach(transaction => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${transaction.transactionID}</td>
                    <td>${transaction.userName}</td>
                    <td>${transaction.categoryName}</td>
                    <td>${transaction.categoryType}</td>
                    <td>${transaction.amount.toFixed(2)}</td>
                    <td>${transaction.formatted_date}</td>
                    <td>${transaction.description}</td>
                    <td>${transaction.tags ? transaction.tags : ""}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error fetching or displaying transactions:", error);
            alert("Failed to fetch filtered transactions. Please try again.");
        });
});
