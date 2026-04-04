(function () {
    function getCurrentTheme() {
        return (
            localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        );
    }

    function applyTheme(theme) {
        var html = document.documentElement;
        var themeToggle = document.getElementById('theme-toggle');
        if (theme === 'dark') {
            html.classList.add('dark-mode');
            if (themeToggle) {
                themeToggle.checked = true;
            }
        } else {
            html.classList.remove('dark-mode');
            if (themeToggle) {
                themeToggle.checked = false;
            }
        }
    }

    applyTheme(getCurrentTheme());
})();
