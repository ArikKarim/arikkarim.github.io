document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Function to update favicon with cache-busting parameter
    function updateFavicon(isDarkMode) {
        // Remove existing favicon links
        const existingLinks = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]');
        existingLinks.forEach(link => link.parentNode.removeChild(link));
        
        // Create timestamp for cache busting
        const timestamp = new Date().getTime();
        
        // Create and add new favicon link with cache busting
        const favicon = document.createElement('link');
        favicon.id = 'favicon';
        favicon.rel = 'icon';
        favicon.href = isDarkMode ? `akfavicon2.ico?v=${timestamp}` : `akfavicon1.ico?v=${timestamp}`;
        favicon.type = 'image/x-icon';
        document.head.appendChild(favicon);
        
        // Add Apple Touch Icon for iOS/iPadOS devices
        const touchIcon = document.createElement('link');
        touchIcon.rel = 'apple-touch-icon';
        touchIcon.href = isDarkMode ? `akfavicon2.ico?v=${timestamp}` : `akfavicon1.ico?v=${timestamp}`;
        document.head.appendChild(touchIcon);
    }
    
    // Set initial favicon based on current theme
    const isDarkMode = document.documentElement.classList.contains('dark-mode');
    updateFavicon(isDarkMode);
    
    // Update checkbox state based on current theme
    themeToggle.checked = isDarkMode;
    
    // Listen for theme toggle changes
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            // Dark mode
            document.documentElement.classList.add('dark-mode');
            updateFavicon(true);
            localStorage.setItem('theme', 'dark');
        } else {
            // Light mode
            document.documentElement.classList.remove('dark-mode');
            updateFavicon(false);
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
                updateFavicon(true);
            } else {
                document.documentElement.classList.remove('dark-mode');
                updateFavicon(false);
            }
        }
    });
});
