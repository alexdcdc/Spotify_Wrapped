

function isAuthenticated() {
  return !!localStorage.getItem("token");
}

function deleteAcct() {
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.top = '0';
  popup.style.left = '0';
  popup.style.width = '100%';
  popup.style.height = '100%';
  popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  popup.style.display = 'flex';
  popup.style.justifyContent = 'center';
  popup.style.alignItems = 'center';
  popup.style.zIndex = '9999';

  // Step 2: Create the confirmation box
  const confirmationBox = document.createElement('div');
  confirmationBox.style.backgroundColor = 'white';
  confirmationBox.style.padding = '20px';
  confirmationBox.style.borderRadius = '10px';
  confirmationBox.style.textAlign = 'center';
  confirmationBox.style.width = '400px';
  confirmationBox.innerHTML = `
    <h2>Unexpected bad things will happen if you don't read this!</h2>
    <p>This action will log you out and you will lose all your Wrapped data.</p>
    <p>To proceed, type your username in the box below:</p>
    <input type="text" id="usernameInput" placeholder="Enter your username" style="width: 100%; padding: 10px; margin-bottom: 15px;" />
    <button id="confirmLogout" style="padding: 10px 20px; margin-right: 10px;">Confirm</button>
    <button id="cancelLogout" style="padding: 10px 20px;">Cancel</button>
  `;

  popup.appendChild(confirmationBox);
  document.body.appendChild(popup);

  document.getElementById('confirmLogout').addEventListener('click', function () {
    const usernameInput = document.getElementById('usernameInput').value;
    const username = 'yourUsername'; // Replace this with the actual username variable

    if (usernameInput === username) {
     // delete all info



    } else {
      alert('Username does not match! Please try again.');
    }
  });

  document.getElementById('cancelLogout').addEventListener('click', function () {
    document.body.removeChild(popup);
  });
}


function logout() {
  localStorage.removeItem('token');
  window.location.href = "http://localhost:3000";

}


export { isAuthenticated, logout, deleteAcct }
