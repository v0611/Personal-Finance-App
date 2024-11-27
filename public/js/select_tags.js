/* Code citation
Date: 11/20/2024
Adapted: Event Listener setup from startercode
From: cs340-nodejs-starter-app, MDN web docs on textcontext
*/

console.log("select_tags.js loaded");

// Select the dropdown and table body
const tagsFilter = document.getElementById("tagFilter");
const tableBody = document.querySelector("#tags tbody");

// Event listener for dropdown change
tagFilter.addEventListener("change", (e) => {
    const selectedTagID = e.target.value;

    // Determine the URL to fetch data
    let url = selectedTagID
        ? `/tags/filter?tagID=${selectedTagID}`
        : '/tags/filter';

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
            <td>${row.tagID}</td>
            <td>${row.tagName}</td>
        `;

        // Append the new row to the table body
        tableBody.appendChild(newRow);

        // Attach delete event listener for the new row
        // const deleteButton = newRow.querySelector(".delete-btn");
        // deleteButton.addEventListener("click", handleDelete);
    });
}

