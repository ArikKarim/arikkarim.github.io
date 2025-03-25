/* Theme Management and Sound Effects Script */
(function() {
    // Detect touch-based devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Get DOM elements with fallback and error handling
    function safeGetElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id '${id}' not found`);
        }
        return element;
    }

    const themeToggle = safeGetElement('theme-toggle');
    const toggleSound = safeGetElement('toggle-sound');
    const untoggleSound = safeGetElement('untoggle-sound');
    
    // Enhanced debugging function
    function logAudioStatus() {
        const browserInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            isTouchDevice: isTouchDevice
        };
        console.log('Browser and Device Info:', browserInfo);

        console.log('Theme Toggle:', themeToggle);
        console.log('Toggle Sound:', toggleSound);
        console.log('Untoggle Sound:', untoggleSound);
        
        // Safely log audio details
        ['toggleSound', 'untoggleSound'].forEach(soundType => {
            const sound = soundType === 'toggleSound' ? toggleSound : untoggleSound;
            if (sound) {
                console.log(`${soundType} Details:`, {
                    src: sound.src,
                    readyState: sound.readyState,
                    canPlay: sound.canPlayType('audio/mpeg') !== '',
                    duration: sound.duration
                });
            }
        });
    }
    
    // Cross-browser sound setup with fallbacks
    function setupSound(audioElement) {
        if (!audioElement) return;

        try {
            // Lower volume for mobile devices
            audioElement.volume = isTouchDevice ? 0.05 : 0.1;
            
            // Preload with fallback
            audioElement.preload = 'metadata';
            
            // Add error handling
            audioElement.addEventListener('error', (e) => {
                console.error('Audio error:', e);
            });
        } catch (error) {
            console.error('Sound setup error:', error);
        }
    }

    // Setup sounds
    setupSound(toggleSound);
    setupSound(untoggleSound);
    
    // Centralized theme management with improved cross-platform support
    const themeManager = {
        getCurrentTheme: function() {
            // Prioritize localStorage, then system preference
            return localStorage.getItem('theme') || 
                   (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        },
        
        applyTheme: function(theme) {
            const html = document.documentElement;
            
            if (theme === 'dark') {
                html.classList.add('dark-mode');
                html.classList.remove('light-mode');
                if (themeToggle) themeToggle.checked = true;
            } else {
                html.classList.add('light-mode');
                html.classList.remove('dark-mode');
                if (themeToggle) themeToggle.checked = false;
            }

            // Trigger reflow for smooth transitions
            html.style.colorScheme = theme;
        },
        
        toggleTheme: function() {
            const currentTheme = this.getCurrentTheme();
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Set theme in localStorage
            localStorage.setItem('theme', newTheme);
            
            // Cross-tab and cross-window synchronization
            localStorage.setItem('theme-sync', JSON.stringify({
                theme: newTheme,
                timestamp: Date.now(),
                source: window.location.href
            }));
            
            // Play sound with enhanced cross-platform error handling
            const playSound = (soundElement) => {
                if (!soundElement) return;

                // Reset playback
                soundElement.currentTime = 0;
                
                // Use promise-based play with multiple fallbacks
                const playPromise = soundElement.play();
                
                if (playPromise !== undefined) {
                    playPromise
                        .catch(error => {
                            // Common reasons for play failure
                            if (error.name === 'NotAllowedError') {
                                console.warn('Audio autoplay blocked');
                            } else if (error.name === 'NotSupportedError') {
                                console.warn('Audio format not supported');
                            } else {
                                console.error('Sound play error:', error);
                            }
                        });
                }
            };

            // Play appropriate sound
            newTheme === 'dark' 
                ? playSound(toggleSound) 
                : playSound(untoggleSound);
            
            // Apply theme locally
            this.applyTheme(newTheme);
        },
        
        init: function() {
            // Apply saved or system theme initially
            this.applyTheme(this.getCurrentTheme());
            
            // Enhanced event binding with touch and click support
            if (themeToggle) {
                // Touch event for mobile devices
                if (isTouchDevice) {
                    themeToggle.addEventListener('touchstart', (e) => {
                        e.preventDefault(); // Prevent double-firing
                        this.toggleTheme();
                    });
                }

                // Click event for desktop
                themeToggle.addEventListener('click', (e) => {
                    this.toggleTheme();
                });

                // Change event as a fallback
                themeToggle.addEventListener('change', (e) => {
                    this.toggleTheme();
                });
            }
            
            // Cross-window theme synchronization
            window.addEventListener('storage', (e) => {
                if (e.key === 'theme-sync') {
                    try {
                        const data = JSON.parse(e.newValue);
                        // Prevent recursive updates
                        if (data.source !== window.location.href) {
                            this.applyTheme(data.theme);
                        }
                    } catch (error) {
                        console.error('Theme sync error:', error);
                    }
                }
            });
        }
    };
    
    // Robust initialization with multiple loading state checks
    const initializeThemeManager = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                themeManager.init();
                logAudioStatus();
            });
        } else if (document.readyState === 'interactive' || document.readyState === 'complete') {
            themeManager.init();
            logAudioStatus();
        } else {
            // Fallback for any unexpected states
            window.addEventListener('load', () => {
                themeManager.init();
                logAudioStatus();
            });
        }
    };

    // Start initialization
    initializeThemeManager();
    
    // Expose for potential manual control
    window.themeManager = themeManager;
})();
