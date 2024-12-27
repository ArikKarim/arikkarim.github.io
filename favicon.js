document.addEventListener("DOMContentLoaded", function () {
    const toggleSwitch = document.querySelector("#theme-toggle");
    const favicon = document.getElementById("favicon");

    // Function to update the favicon
    function updateFavicon(isDarkMode) {
        favicon.href = isDarkMode ? "akfavicon2.ico" : "akfavicon1.ico";
    }

    // Apply saved theme from localStorage and update favicon
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        updateFavicon(true);  // Set dark mode favicon
    } else {
        document.documentElement.classList.remove('dark-mode');
        updateFavicon(false); // Set light mode favicon
    }

    // Listen for toggle changes and update theme and favicon
    toggleSwitch.addEventListener("change", function () {
        if (toggleSwitch.checked) {
            document.documentElement.classList.add('dark-mode');
            updateFavicon(true);
            localStorage.setItem('theme', 'dark'); // Save theme preference
        } else {
            document.documentElement.classList.remove('dark-mode');
            updateFavicon(false);
            localStorage.setItem('theme', 'light'); // Save theme preference
        }
    });
});
