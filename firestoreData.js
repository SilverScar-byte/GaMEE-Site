// Import necessary Firebase SDK modules
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";

// Firebase configuration (match with Dashboard.html)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "gameer-login.firebaseapp.com",
    projectId: "gameer-login",
    storageBucket: "gameer-login.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get references to Firebase Authentication and Firestore
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Function to save data to Firestore
async function saveUserData() {
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

    try {
        await setDoc(userRef, {
            username: username,
            mainHero: mainHero,
            overview: overview,
            achievements: achievements
        });
        alert("User data saved successfully!");
    } catch (error) {
        console.error("Error saving data:", error);
    }
}

// Function to load user data from Firestore
async function loadUserData() {
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (!userId) {
        console.error("No user is logged in.");
        return null;
    }

    const userRef = doc(db, "users", userId);

    try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById("username").value = data.username || "";
            document.getElementById("main-hero").value = data.mainHero || "";
            document.getElementById("overview-text-box").value = data.overview || "";
            document.getElementById("achievements-text-box").value = data.achievements || "";
            console.log("User data loaded successfully!");
        } else {
            console.log("No user data found.");
        }
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Export the functions for use in Dashboard.html
export { saveUserData, loadUserData };
