// Updated firestoreData.js to use module imports and ensure proper initialization

// Import necessary Firebase SDK modules
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";

// Firebase configuration (same as in your dashboard HTML)
const firebaseConfig = {
    apiKey: "AIzaSyBcl9zwXRRNnxmKlvB0LBaIPXX7kIxxohA",
    authDomain: "gameer-login.firebaseapp.com",
    projectId: "gameer-login",
    storageBucket: "gameer-login.firebasestorage.app",
    messagingSenderId: "1081287852231",
    appId: "1:1081287852231:web:7fe00f84f1c7e1aaecfee2",
    measurementId: "G-FL9Q322WG6"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to Firebase Authentication and Firestore
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Function to save data to Firestore
function saveUserData() {
    // Ensure the user is logged in before attempting to save data
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (!userId) {
        console.error("No user is logged in.");
        return;
    }

    // Collect data from input fields
    const username = document.getElementById('username').value;
    const mainHero = document.getElementById('main-hero').value;
    const overview = document.getElementById('overview-text-box').value;
    const achievements = document.getElementById('achievements-text-box').value;

    // Get a reference to the user's document in Firestore
    const userRef = doc(db, "users", userId);

    // Save data to Firestore
    setDoc(userRef, {
        username: username,
        mainHero: mainHero,
        overview: overview,
        achievements: achievements
    })
    .then(() => {
        console.log("User data saved!");
    })
    .catch((error) => {
        console.error("Error saving data: ", error);
    });
}

// Export the saveUserData function for use in other parts of your app
export { saveUserData };
