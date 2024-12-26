// Retrieve elements for the toggle switch and sound effects
const toggleSwitch = document.getElementById('theme-toggle');
const toggleSound = document.getElementById('toggle-sound');
const untoggleSound = document.getElementById('untoggle-sound');

// Set volume for both sounds (10% volume)
toggleSound.volume = 0.1;
untoggleSound.volume = 0.1;

// Function to apply dark mode
function applyDarkMode(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    toggleSwitch.checked = isDark;
}

// Initialize theme based on localStorage
(function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        applyDarkMode(true);
    } else if (savedTheme === 'light') {
        applyDarkMode(false);
    } else {
        // Default to dark mode if no preference is found
        applyDarkMode(true);
        localStorage.setItem('theme', 'dark');
    }
})();

// Event listener for the toggle switch
toggleSwitch.addEventListener('change', () => {
    const isDarkMode = toggleSwitch.checked;

    // Play the appropriate sound based on the toggle state
    if (isDarkMode) {
        toggleSound.play(); // Dark mode sound
        localStorage.setItem('theme', 'dark');
    } else {
        untoggleSound.play(); // Light mode sound
        localStorage.setItem('theme', 'light');
    }

    applyDarkMode(isDarkMode); // Apply the theme
});
