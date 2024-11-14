// logout.js
function logout() {
    firebase.auth().signOut().then(() => {
        console.log("User signed out successfully.");
        window.location.href = "Login.html"; // Redirect to your login page
    }).catch((error) => {
        console.error("Error signing out: ", error);
    });
}

// Attach the logout function to the button
document.getElementById('logout-btn').addEventListener('click', logout);
