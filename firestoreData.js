// Import necessary Firebase SDK modules
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";

// Firebase configuration (match with Dashboard.html)
const firebaseConfig = {
  apiKey: "AIzaSyBcl9zwXRRNnxmKlvB0LBaIPXX7kIxxohA",
  authDomain: "gameer-login.firebaseapp.com",
  projectId: "gameer-login",
  storageBucket: "gameer-login.appspot.com",  // Corrected storage bucket URL
  messagingSenderId: "1081287852231",
  appId: "1:1081287852231:web:7fe00f84f1c7e1aaecfee2",
  measurementId: "G-FL9Q322WG6"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get references to Firebase Authentication, Firestore, and Storage
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

// Function to save data to Firestore, including profile picture URL
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
    const profilePictureElement = document.getElementById('profile-picture');
    const profilePictureFile = document.getElementById('profile-picture-input').files[0];  // Get the selected file if any

    let profilePictureUrl = profilePictureElement.src;  // Default to the current profile picture URL

    // If a new profile picture is selected, upload it and get the URL
    if (profilePictureFile) {
        try {
            profilePictureUrl = await uploadProfilePicture(profilePictureFile);  // Upload and get the URL
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            return;
        }
    }

    // Save the user data (including profile picture URL) to Firestore
    const userRef = doc(db, "users", userId);
    try {
        await setDoc(userRef, {
            username,
            mainHero,
            overview,
            achievements,
            profilePicture: profilePictureUrl
        }, { merge: true });
        
        console.log("User data saved successfully!");
    } catch (error) {
        console.error("Error saving data:", error);
    }
}

// Function to upload a profile picture to Firebase Storage and return its URL
async function uploadProfilePicture(file) {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        console.error("No user is logged in.");
        return;
    }

    // Upload the image to Firebase Storage
    const storageRef = ref(storage, `profilePictures/${userId}`);
    try {
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);  // Get the image URL
        console.log("Profile picture uploaded successfully!");
        
        return url;  // Return the URL for immediate use (e.g., to display the image)
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        throw error;  // Rethrow the error for handling in saveUserData
    }
}

// Function to load user data from Firestore, including profile picture
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

            // Load the profile picture if available
            const profilePictureUrl = data.profilePicture || "images/default-profile.jpg";
            document.getElementById("profile-picture").src = profilePictureUrl;
            console.log("User data loaded successfully!");

            // Automatically save the data once it's loaded
            await saveUserData();
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
        window.location.href = 'login.html';  // Ensure correct path for login page
    }
});

// Export the functions for use in Dashboard.html
export { saveUserData, loadUserData, uploadProfilePicture };
