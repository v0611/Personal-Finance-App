/* Code citation
Date: 11/20/2024
Adapted: Event Listener setup from startercode, createElement(), appendChild() from MDN
From: cs340-nodejs-starter-app, MDN web docs on textcontext
*/

console.log("add_tags.js loaded");

let addTagsForm = document.getElementById('add-new-tags');

addTagsForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent page reload

    let inputTagName = document.getElementById("tag-name");

    // NULL check
    if (!inputTagName.value.trim()) {
      alert("Please supply a tag name.");
      return;
    }

    let data = {
        tagName: inputTagName.value
    };

    console.log('Data being sent:', data);

    fetch('/tags/add', {
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
        .then(newTag => {
            console.log('Server response:', newTag);

            
            addNewTagRow(newTag[0]);  // add the newly created record to the table 

            // clear form 
            inputTagName.value = '';
        })
        .catch(error => console.error('Error:', error));
});

// Function to add a new row to the table
function addNewTagRow(data) {
    let tableBody = document.querySelector("#tags tbody");

    
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${data.tagID}</td>
        <td>${data.tagName}</td>
    `;

    // Append the new row to the table body
    tableBody.appendChild(newRow);
};


