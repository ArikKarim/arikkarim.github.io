document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const toggleSound = document.getElementById('toggle-sound');
    const untoggleSound = document.getElementById('untoggle-sound');

    // Ensure all elements exist before proceeding
    if (!themeToggle) {
        console.error('Theme toggle element not found');
        return;
    }

    // Debugging function
    function logElementStatus() {
        console.log('Theme Toggle:', themeToggle);
        console.log('Toggle Sound:', toggleSound);
        console.log('Untoggle Sound:', untoggleSound);
    }

    // Get current theme
    function getCurrentTheme() {
        return localStorage.getItem('theme') || 
               (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }

    // Apply theme
    function applyTheme(theme) {
        const html = document.documentElement;
        
        if (theme === 'dark') {
            html.classList.add('dark-mode');
            themeToggle.checked = true;
        } else {
            html.classList.remove('dark-mode');
            themeToggle.checked = false;
        }

        // Update localStorage
        localStorage.setItem('theme', theme);
    }

    // Toggle theme function
    function toggleTheme() {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Play sound
        try {
            if (newTheme === 'dark' && toggleSound) {
                toggleSound.currentTime = 0;
                toggleSound.play().catch(error => console.error('Toggle sound error:', error));
            } else if (newTheme === 'light' && untoggleSound) {
                untoggleSound.currentTime = 0;
                untoggleSound.play().catch(error => console.error('Untoggle sound error:', error));
            }
        } catch (error) {
            console.error('Sound play error:', error);
        }

        // Apply new theme
        applyTheme(newTheme);

        // Sync across tabs
        localStorage.setItem('theme-sync', JSON.stringify({
            theme: newTheme,
            timestamp: Date.now()
        }));
    }

    // Event listeners with multiple methods
    function setupEventListeners() {
        // Checkbox change
        themeToggle.addEventListener('change', function(e) {
            console.log('Checkbox changed');
            toggleTheme();
        });

        // Label click (fallback)
        const toggleLabel = themeToggle.closest('label');
        if (toggleLabel) {
            toggleLabel.addEventListener('click', function(e) {
                console.log('Label clicked');
                // Prevent double-firing
                e.preventDefault();
                toggleTheme();
            });
        }

        // Touch support
        themeToggle.addEventListener('touchstart', function(e) {
            console.log('Touch started');
            e.preventDefault();
            toggleTheme();
        });
    }

    // Cross-tab sync
    window.addEventListener('storage', function(e) {
        if (e.key === 'theme-sync') {
            try {
                const data = JSON.parse(e.newValue);
                applyTheme(data.theme);
            } catch (error) {
                console.error('Theme sync error:', error);
            }
        }
    });

    // Initial setup
    applyTheme(getCurrentTheme());
    setupEventListeners();
    logElementStatus();
});
