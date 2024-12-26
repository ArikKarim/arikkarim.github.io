// Get the toggle switch element
const toggleSwitch = document.getElementById('theme-toggle');
const toggleSound = document.getElementById('toggle-sound'); // Retrieves the toggle sound element
const untoggleSound = document.getElementById('untoggle-sound'); // Retrieves the untoggle sound element

// Set volume for both sounds (adjust this value as needed)
toggleSound.volume = 0.1; // 10% volume for the toggle sound (dark mode)
untoggleSound.volume = 0.1; // 10% volume for the untoggle sound (light mode)

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
    // Play the appropriate sound when the toggle button is clicked
    if (toggleSwitch.checked) {
        toggleSound.play(); // Play sound when toggling to dark mode
        localStorage.setItem('theme', 'dark');
        applyDarkMode(true);
    } else {
        untoggleSound.play(); // Play sound when toggling to light mode
        localStorage.setItem('theme', 'light');
        applyDarkMode(false);
    }
});
