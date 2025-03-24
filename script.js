/* Theme Management Script */
(function() {
    // Centralized theme management
    const themeManager = {
        // Get the current theme
        getCurrentTheme: function() {
            return localStorage.getItem('theme') || 
                   (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        },

        // Apply theme
        applyTheme: function(theme) {
            const html = document.documentElement;
            const themeToggle = document.getElementById('theme-toggle');

            if (theme === 'dark') {
                html.classList.add('dark-mode');
                if (themeToggle) themeToggle.checked = true;
            } else {
                html.classList.remove('dark-mode');
                if (themeToggle) themeToggle.checked = false;
            }
        },

        // Toggle theme
        toggleTheme: function() {
            const html = document.documentElement;
            html.classList.toggle('dark-mode');
            
            const newTheme = html.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            
            // Dispatch event to sync across pages
            window.dispatchEvent(new Event('themeChanged'));
        },

        // Initialize theme toggle listeners
        init: function() {
            // Apply saved or system theme
            this.applyTheme(this.getCurrentTheme());

            // Add toggle event listener
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('change', () => this.toggleTheme());
            }

            // Listen for theme changes across tabs/windows
            window.addEventListener('storage', (e) => {
                if (e.key === 'theme') {
                    this.applyTheme(e.newValue);
                }
            });

            // Cross-page theme sync
            window.addEventListener('themeChanged', () => {
                this.applyTheme(this.getCurrentTheme());
            });

            // Handle system theme preference changes
            window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
                if (!localStorage.getItem('theme')) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    };

    // Ensure DOM is loaded before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => themeManager.init());
    } else {
        themeManager.init();
    }

    // Expose for potential manual control
    window.themeManager = themeManager;
})();

// Optional: Sound effects for theme toggle
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const toggleSound = document.getElementById('toggle-sound');
    const untoggleSound = document.getElementById('untoggle-sound');

    if (themeToggle && toggleSound && untoggleSound) {
        themeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                toggleSound.play();
            } else {
                untoggleSound.play();
            }
        });
    }
});
