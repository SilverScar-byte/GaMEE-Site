// Import necessary Firebase SDK modules
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";

// Firebase configuration (match with Dashboard.html)
const firebaseConfig = {
  apiKey: "AIzaSyBcl9zwXRRNnxmKlvB0LBaIPXX7kIxxohA",
  authDomain: "gameer-login.firebaseapp.com",
  projectId: "gameer-login",
  storageBucket: "gameer-login.appspot.com",
  messagingSenderId: "1081287852231",
  appId: "1:1081287852231:web:7fe00f84f1c7e1aaecfee2",
  measurementId: "G-FL9Q322WG6"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get references to Firebase Authentication and Firestore
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Cloudinary configuration
const cloudinaryUploadUrl = "https://api.cloudinary.com/v1_1/<your-cloud-name>/upload";
const cloudinaryPreset = "<your-upload-preset>";

// Function to save data to Firestore, excluding profile picture upload
async function saveUserData() {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        console.error("No user is logged in.");
        return;
    }

    // Collect data from input fields
    const username = document.getElementById('username').value;
    const mainHero = document.getElementById('main-hero').value;
    const overview = document.getElementById('overview-text-box').value;
    const achievements = document.getElementById('achievements-text-box').value;

    // Save the user data to Firestore
    const userRef = doc(db, "users", userId);
    try {
        await setDoc(userRef, {
            username,
            mainHero,
            overview,
            achievements
        }, { merge: true });
        console.log("User data saved successfully!");
    } catch (error) {
        console.error("Error saving data:", error);
    }
}

// Function to upload a profile picture to Cloudinary and return its URL
async function uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryPreset);

    try {
        const response = await fetch(cloudinaryUploadUrl, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Cloudinary upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Profile picture uploaded successfully!");
        return data.secure_url; // Return the Cloudinary URL
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        throw error; // Rethrow the error for handling in saveUserData
    }
}

// Function to load user data from Firestore
async function loadUserData() {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        console.error("No user is logged in.");
        return;
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

            // Load the profile picture from the Cloudinary URL if available
            const profilePictureUrl = data.profilePicture || "images/default-profile.jpg";
            document.getElementById("profile-picture").src = profilePictureUrl;
            console.log("User data loaded successfully!");
        } else {
            console.log("No user data found.");
        }
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Check for user authentication status changes and load data or redirect
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is authenticated, loading dashboard data...");
        loadUserData();
    } else {
        console.warn("User is not authenticated, redirecting to login.");
        window.location.href = 'login.html'; // Ensure correct path for login page
    }
});

// Export the functions for use in Dashboard.html
export { saveUserData, loadUserData, uploadProfilePicture };
