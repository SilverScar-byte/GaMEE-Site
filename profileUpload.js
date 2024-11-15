document.getElementById('upload-profile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        // Create a FileReader to show a preview on the dashboard
        const reader = new FileReader();
        reader.onload = function() {
            document.getElementById('profile-picture').src = reader.result; // Preview the image
        };
        reader.readAsDataURL(file);

        // Firebase Storage Upload
        const storageRef = firebase.storage().ref();
        const user = firebase.auth().currentUser;
        if (user) {
            const profilePictureRef = storageRef.child(`profilePictures/${user.uid}/${file.name}`);
            
            profilePictureRef.put(file).then(snapshot => {
                // Get the URL of the uploaded image
                return snapshot.ref.getDownloadURL();
            }).then(downloadURL => {
                // Update Firestore with the new profile picture URL
                const db = firebase.firestore();
                return db.collection('users').doc(user.uid).update({
                    profilePicture: downloadURL
                }).then(() => {
                    console.log('Profile picture updated successfully in Firestore.');
                });
            }).catch(error => {
                console.error('Error uploading profile picture:', error);
            });
        } else {
            console.error('No user is signed in.');
        }
    } else {
        console.error('No file selected.');
    }
});
