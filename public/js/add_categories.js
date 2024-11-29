/* Code citation
Date: 11/20/2024
Adapted: Event Listener setup from startercode, createElement(), appendChild() from MDN
From: cs340-nodejs-starter-app, MDN web docs on textcontext
*/

console.log("add_categories.js loaded");

// Initialize an empty categoriesList (populate drop down dynamically for newly added record)
let categoriesList = [];

// Fetch categories from the backend to populate the category drop down for new record 
fetch('/categories/types')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch categories.');
        }
        return response.json();
    })
    .then(categoryTypes => {
      const dropdown = document.getElementById('categoryID');

      // Clear existing options (if any)
      dropdown.innerHTML = '<option value="">Select a Category Type</option>';

      // Add new options dynamically
      categoryTypes.forEach(type => {
          const option = document.createElement('option');
          option.value = type.categoryType;
          option.textContent = type.categoryType;
          dropdown.appendChild(option);
      });

      console.log('Dropdown populated with category types:', categoryTypes);
  })
  .catch(error => console.error('Error fetching category types:', error));

// Get the form element
let addCategoriesForm = document.getElementById('add-new-category');

addCategoriesForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent page reload

    let inputCategoryName = document.getElementById("category-name");
    let inputCategoryType = document.getElementById("categoryID");

    let data = {
        categoryName: inputCategoryName.value,
        categoryType: inputCategoryType.value,
    };

    console.log('Data being sent:', data);

    fetch('/categories/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with failure: ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(newRows => {
            console.log('Server response:', newRows);

            // Dynamically add the newly created record to the table
            newRows.forEach(row => addNewCategoryRow(row, categoriesList));

            // Clear form
            inputCategoryName.value = '';
            inputCategoryType.value = '';
        })
        .catch(error => console.error('Error:', error));
});

// Function to dynamically add a new row to the table
function addNewCategoryRow(row, categories) {
    let tableBody = document.querySelector("#categories tbody");

    let newRow = document.createElement("tr");
    newRow.setAttribute("data-value", row.categoryID);

    newRow.innerHTML = `
        <td>${row.categoryID}</td>
        <td>${row.categoryName}</td>
        <td>${row.categoryType}</td>
    `;

    // Append the new row to the table body
    tableBody.appendChild(newRow);

}
