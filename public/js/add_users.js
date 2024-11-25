/* Code citation
Date: 11/20/2024
Adapted: Event Listener setup from startercode, createElement(), appendChild() from MDN
From: cs340-nodejs-starter-app, MDN web docs on textcontext
*/

console.log("add_users.js loaded");

let addUsersForm = document.getElementById('add-new-users');

addUsersForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent page reload

    let inputUserName = document.getElementById("user-name");
    let inputUserEmail = document.getElementById("user-email");
    let inputUserPassword = document.getElementById("password");

    // NULL check
    if (!inputUserName.value.trim()) {
      alert("Please supply a user name.");
      return;
    }

    if (!inputUserEmail.value.trim()) {
      alert("Please supply a valid email.");
      return;
    }

    if (!inputUserPassword.value.trim()) {
      alert("Please supply a valid password.");
      return;
    }

    let data = {
        userName: inputUserName.value,
        userEmail: inputUserEmail.value,
        userPassword: inputUserPassword.value,
    };

    console.log('Data being sent:', data);

    fetch('/users/add', {
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
        .then(newRow => {
            console.log('Server response:', newRow);

            // add the newly created record to the table 
            addNewUserRow(newRow);

            // clear form 
            inputUserName.value = '';
            inputUserEmail.value = '';
            inputUserPassword.value = '';
        })
        .catch(error => console.error('Error:', error));
});

// Function to add a new row to the table
function addNewUserRow(data) {
    let tableBody = document.querySelector("#users tbody");

    data.forEach(row => {
        let newRow = document.createElement("tr");
        newRow.setAttribute("data-value", row.userID);

        newRow.innerHTML = `
            <td>${row.userID}</td>
            <td>${row.userName}</td>
            <td>${row.userEmail}</td>
            <td>${row.userPassword}</td>
        `;

        // Append the new row to the table body
        tableBody.appendChild(newRow);
    });
}

