// Import necessary Firebase SDK modules
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";

// Firebase configuration
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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Save user data to Firestore
async function saveUserData() {
    const user = auth.currentUser;
    if (!user) {
        console.error("No user is logged in.");
        return;
    }

    const userId = user.uid;
    const username = document.getElementById('username').value;
    const mainHero = document.getElementById('main-hero').value;
    const overview = document.getElementById('overview-text-box').value;
    const achievements = document.getElementById('achievements-text-box').value;
    const profilePictureElement = document.getElementById('profile-picture');
    const profilePictureFile = document.getElementById('upload-profile').files[0];

    let profilePictureUrl = profilePictureElement.src;

    if (profilePictureFile) {
        try {
            profilePictureUrl = await uploadProfilePicture(profilePictureFile);
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            return;
        }
    }

    try {
        await setDoc(doc(db, "users", userId), {
            username,
            mainHero,
            overview,
            achievements,
            profilePicture: profilePictureUrl
        }, { merge: true });
        console.log("User data saved successfully!");
    } catch (error) {
        console.error("Error saving user data:", error);
    }
}

// Upload profile picture to Firebase Storage and return URL
async function uploadProfilePicture(file) {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("No user is logged in.");
    }

    const storageRef = ref(storage, `profilePictures/${user.uid}`);
    try {
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        console.log("Profile picture uploaded successfully!");
        return url;
    } catch (error) {
        throw new Error("Error uploading profile picture: " + error.message);
    }
}

// Load user data from Firestore
async function loadUserData() {
    const user = auth.currentUser;
    if (!user) {
        console.error("No user is logged in.");
        return;
    }

    try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('username').value = data.username || "";
            document.getElementById('main-hero').value = data.mainHero || "";
            document.getElementById('overview-text-box').value = data.overview || "";
            document.getElementById('achievements-text-box').value = data.achievements || "";
            document.getElementById('profile-picture').src = data.profilePicture || "images/default-profile.jpg";
            console.log("User data loaded successfully!");
        } else {
            console.log("No user data found.");
        }
    } catch (error) {
        console.error("Error loading user data:", error);
    }
}

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User authenticated. Loading data...");
        loadUserData();
    } else {
        console.warn("User not authenticated. Redirecting to login.");
        window.location.href = "login.html";
    }
});
