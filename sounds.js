// Get the toggle switch element
const toggleSwitch = document.getElementById('theme-toggle');
const toggleSound = document.getElementById('toggle-sound'); // Get the audio element

// Function to apply dark mode
function applyDarkMode(isDark) {
    if (isDark) {
        document.body.classList.add('dark-mode');
        toggleSwitch.checked = true; // Check the toggle switch
    } else {
        document.body.classList.remove('dark-mode');
        toggleSwitch.checked = false; // Uncheck the toggle switch
    }
}

// Check if there's a stored theme preference in localStorage
const savedTheme = localStorage.getItem('theme');

// If no theme preference is saved, default to dark mode
if (savedTheme === 'dark') {
    applyDarkMode(true);
} else if (savedTheme === 'light') {
    applyDarkMode(false);
} else {
    // If no preference in localStorage, default to dark mode
    applyDarkMode(true); // Set dark mode as default
    localStorage.setItem('theme', 'dark'); // Save dark mode as the default
}

// Listen for changes to the toggle switch
toggleSwitch.addEventListener('change', () => {
    // Play the sound when the toggle button is clicked
    toggleSound.play();

    if (toggleSwitch.checked) {
        // Save the preference to localStorage
        localStorage.setItem('theme', 'dark');
        applyDarkMode(true);
    } else {
        // Save the preference to localStorage
        localStorage.setItem('theme', 'light');
        applyDarkMode(false);
    }
});
