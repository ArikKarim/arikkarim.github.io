// Get the toggle switch element
const toggleSwitch = document.getElementById('theme-toggle');

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

// If a preference exists, apply it, otherwise default to light mode
if (savedTheme === 'dark') {
    applyDarkMode(true);
} else {
    applyDarkMode(false);
}

// Listen for changes to the toggle switch
toggleSwitch.addEventListener('change', () => {
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
