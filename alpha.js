document.addEventListener('DOMContentLoaded', function () {
    // Select the theme toggle switch
    const themeToggle = document.getElementById('theme-toggle');

    // Function to get the current theme from localStorage or system preference
    function getCurrentTheme() {
        return localStorage.getItem('theme') || 
               (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }

    // Function to apply the theme and update the toggle position
    function applyTheme(theme) {
        document.documentElement.classList.toggle('dark-mode', theme === 'dark');
        if (themeToggle) {
            themeToggle.checked = (theme === 'dark');
        }
    }

    // Initialize theme on page load
    const savedTheme = getCurrentTheme();
    applyTheme(savedTheme);

    // Toggle theme on switch change
    if (themeToggle) {
        themeToggle.addEventListener('change', function () {
            const newTheme = this.checked ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);

            // Sync theme with other open pages
            localStorage.setItem('theme-sync', JSON.stringify({
                theme: newTheme,
                timestamp: new Date().getTime()
            }));
        });
    }

    // Sync theme changes across multiple open tabs
    window.addEventListener('storage', function (event) {
        if (event.key === 'theme-sync') {
            const data = JSON.parse(event.newValue);
            applyTheme(data.theme);
        }
    });
});
