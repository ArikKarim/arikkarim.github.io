/* Theme Management and Sound Effects Script */
(function() {
    // Get DOM elements
    const themeToggle = document.getElementById('theme-toggle');
    const toggleSound = document.getElementById('toggle-sound');
    const untoggleSound = document.getElementById('untoggle-sound');
    
    // Debugging function
    function logAudioStatus() {
        console.log('Theme Toggle:', themeToggle);
        console.log('Toggle Sound:', toggleSound);
        console.log('Untoggle Sound:', untoggleSound);
        
        if (toggleSound) {
            console.log('Toggle Sound Src:', toggleSound.src);
            console.log('Toggle Sound Ready State:', toggleSound.readyState);
        }
        if (untoggleSound) {
            console.log('Untoggle Sound Src:', untoggleSound.src);
            console.log('Untoggle Sound Ready State:', untoggleSound.readyState);
        }
    }
    
    // Set sound volumes and preload
    if (toggleSound) {
        toggleSound.volume = 0.1;
        toggleSound.preload = 'auto';
    }
    if (untoggleSound) {
        untoggleSound.volume = 0.1;
        untoggleSound.preload = 'auto';
    }
    
    // Centralized theme management
    const themeManager = {
        getCurrentTheme: function() {
            return localStorage.getItem('theme') || 
                   (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        },
        
        applyTheme: function(theme) {
            const html = document.documentElement;
            
            if (theme === 'dark') {
                html.classList.add('dark-mode');
                if (themeToggle) themeToggle.checked = true;
            } else {
                html.classList.remove('dark-mode');
                if (themeToggle) themeToggle.checked = false;
            }
        },
        
        toggleTheme: function() {
            console.log('Toggle Theme Called'); // Debug log
            const currentTheme = this.getCurrentTheme();
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            console.log(`Switching from ${currentTheme} to ${newTheme}`); // Debug log
            
            // Set theme in localStorage
            localStorage.setItem('theme', newTheme);
            
            // Broadcast theme change across all pages/tabs
            localStorage.setItem('theme-sync', JSON.stringify({
                theme: newTheme,
                timestamp: Date.now()
            }));
            
            // Play appropriate sound with error handling
            try {
                if (newTheme === 'dark' && toggleSound) {
                    console.log('Attempting to play toggle sound'); // Debug log
                    toggleSound.currentTime = 0;
                    toggleSound.play().catch(error => {
                        console.error('Toggle Sound Play Error:', error);
                    });
                } else if (newTheme === 'light' && untoggleSound) {
                    console.log('Attempting to play untoggle sound'); // Debug log
                    untoggleSound.currentTime = 0;
                    untoggleSound.play().catch(error => {
                        console.error('Untoggle Sound Play Error:', error);
                    });
                }
            } catch (error) {
                console.error('Sound Play Error:', error);
            }
            
            // Apply theme locally
            this.applyTheme(newTheme);
        },
        
        init: function() {
            // Apply saved or system theme initially
            this.applyTheme(this.getCurrentTheme());
            
            // Alternative event binding methods
            if (themeToggle) {
                // Method 1: Click event on the label
                const toggleLabel = themeToggle.closest('label');
                if (toggleLabel) {
                    toggleLabel.addEventListener('click', (e) => {
                        console.log('Label Clicked'); // Debug log
                        this.toggleTheme();
                    });
                }
                
                // Method 2: Change event on checkbox
                themeToggle.addEventListener('change', (e) => {
                    console.log('Checkbox Changed'); // Debug log
                    this.toggleTheme();
                });
            }
            
            // Rest of the initialization remains the same
            window.addEventListener('storage', (e) => {
                if (e.key === 'theme-sync') {
                    try {
                        const data = JSON.parse(e.newValue);
                        this.applyTheme(data.theme);
                    } catch (error) {
                        console.error('Theme sync error:', error);
                    }
                }
            });
        }
    };
    
    // Ensure DOM is loaded before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            themeManager.init();
            logAudioStatus(); // Log audio status on load
        });
    } else {
        themeManager.init();
        logAudioStatus(); // Log audio status on load
    }
    
    // Expose for potential manual control
    window.themeManager = themeManager;
})();
