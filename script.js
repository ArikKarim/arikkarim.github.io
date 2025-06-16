document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const toggleSound = document.getElementById('toggle-sound');
    const untoggleSound = document.getElementById('untoggle-sound');
    
    // Ensure all elements exist before proceeding
    if (!themeToggle) {
        console.error('Theme toggle element not found');
        return;
    }
    
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
            updateFavicon(true); // Update favicon to dark mode
        } else {
            html.classList.remove('dark-mode');
            themeToggle.checked = false;
            updateFavicon(false); // Update favicon to light mode
        }
        
        // Update localStorage
        localStorage.setItem('theme', theme);
    }
    
    // Play sound based on theme
    /*
    function playThemeSound(theme) {
        // Create audio elements if they don't exist
        if (!toggleSound) {
            const toggleAudio = document.createElement('audio');
            toggleAudio.id = 'toggle-sound';
            toggleAudio.src = 'toggle-sound.mp3';
            toggleAudio.preload = 'auto';
            document.body.appendChild(toggleAudio);
        }
        
        if (!untoggleSound) {
            const untoggleAudio = document.createElement('audio');
            untoggleAudio.id = 'untoggle-sound';
            untoggleAudio.src = 'untoggle-sound.mp3';
            untoggleAudio.preload = 'auto';
            document.body.appendChild(untoggleAudio);
        }
        
        // Get the updated elements
        const toggleAudio = document.getElementById('toggle-sound');
        const untoggleAudio = document.getElementById('untoggle-sound');
        
        try {
            if (theme === 'dark' && toggleAudio) {
                toggleAudio.currentTime = 0;
                toggleAudio.play().catch(error => console.error('Toggle sound error:', error));
            } else if (theme === 'light' && untoggleAudio) {
                untoggleAudio.currentTime = 0;
                untoggleAudio.play().catch(error => console.error('Untoggle sound error:', error));
            }
        } catch (error) {
            console.error('Sound play error:', error);
        }
    }
    */
    
    // Toggle theme function
    function toggleTheme() {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Play sound
        // playThemeSound(newTheme);
        
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
        
        // Listen for system preference changes
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkModeMediaQuery.addEventListener('change', function(e) {
            // Only apply if user hasn't set a preference
            if (!localStorage.getItem('theme')) {
                const newDarkMode = e.matches;
                const newTheme = newDarkMode ? 'dark' : 'light';
                
                // Play sound for theme change
                // playThemeSound(newTheme);
                
                // Apply theme
                applyTheme(newTheme);
            }
        });
    }

        // Text reveal animation setup
    function setupTextReveal() {
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .reveal-text');

        elements.forEach(el => {
            // Ensure base class is present for animation
            if (!el.classList.contains('reveal-text')) {
                el.classList.add('reveal-text');
            }
        });

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    obs.unobserve(entry.target); // Animate only once
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));
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
    setupTextReveal();
    logElementStatus();
});
