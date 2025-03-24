/* script.js */
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    /* Check if dark mode is active and set toggle accordingly */
    const isDarkMode = html.classList.contains('dark-mode');
    toggle.checked = isDarkMode;
    
    /* Handle toggle changes */
    toggle.addEventListener('change', function() {
        /* Toggle dark mode class on HTML element (not body) */
        html.classList.toggle('dark-mode');
        
        /* Save preference to localStorage */
        if (html.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
});
