document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const faviconLink = document.getElementById('favicon');
    
    // Set initial favicon based on current theme
    if (document.documentElement.classList.contains('dark-mode')) {
        faviconLink.href = 'akfavicon2.ico'; // Dark mode favicon
    } else {
        faviconLink.href = 'akfavicon1.ico'; // Light mode favicon
    }
    
    // Update checkbox state based on current theme
    themeToggle.checked = document.documentElement.classList.contains('dark-mode');
    
    // Listen for theme toggle changes
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            // Dark mode
            document.documentElement.classList.add('dark-mode');
            faviconLink.href = 'akfavicon2.ico';
            localStorage.setItem('theme', 'dark');
        } else {
            // Light mode
            document.documentElement.classList.remove('dark-mode');
            faviconLink.href = 'akfavicon1.ico';
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Listen for system preference changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', function(e) {
        // Only apply if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
            const newDarkMode = e.matches;
            themeToggle.checked = newDarkMode;
            
            if (newDarkMode) {
                document.documentElement.classList.add('dark-mode');
                faviconLink.href = 'akfavicon2.ico';
            } else {
                document.documentElement.classList.remove('dark-mode');
                faviconLink.href = 'akfavicon1.ico';
            }
        }
    });
});
