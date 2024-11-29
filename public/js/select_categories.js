/* Code citation
Date: 11/20/2024
Adapted: Event Listener setup from startercode
From: cs340-nodejs-starter-app, MDN web docs on textcontext
*/

console.log("select_categories.js loaded");

// Select the dropdown and table body
const categoryFilter = document.getElementById("categoryFilter");
const tableBody = document.querySelector("#categories tbody");

// Event listener for dropdown change
categoryFilter.addEventListener("change", (e) => {
    const selectedCategoryID = e.target.value;

    // Determine the URL to fetch data
    let url = selectedCategoryID
        ? `/categories/filter?categoryID=${selectedCategoryID}`
        : '/categories/filter';

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
            <td>${row.categoryID}</td>
            <td>${row.categoryName}</td>
            <td>${row.categoryType}</td>
        `;

        // Append the new row to the table body
        tableBody.appendChild(newRow);

        // Attach delete event listener for the new row
        // const deleteButton = newRow.querySelector(".delete-btn");
        // deleteButton.addEventListener("click", handleDelete);
    });
}

