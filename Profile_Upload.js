// JavaScript to handle profile picture update
document.getElementById('upload-profile').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-picture').src = e.target.result; // Update to new picture
        };
        reader.readAsDataURL(file); // Convert image to data URL
    }
});
