document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) {
        return;
    }

    function updateFavicon(isDarkMode) {
        document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach(function (link) {
            link.parentNode.removeChild(link);
        });
        var timestamp = new Date().getTime();
        var favicon = document.createElement('link');
        favicon.id = 'favicon';
        favicon.rel = 'icon';
        favicon.href = (isDarkMode ? '/akfavicon2.ico' : '/akfavicon1.ico') + '?v=' + timestamp;
        favicon.type = 'image/x-icon';
        document.head.appendChild(favicon);
        var touchIcon = document.createElement('link');
        touchIcon.rel = 'apple-touch-icon';
        touchIcon.href = (isDarkMode ? '/akfavicon2.ico' : '/akfavicon1.ico') + '?v=' + timestamp;
        document.head.appendChild(touchIcon);
    }

    function getCurrentTheme() {
        return (
            localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        );
    }

    function applyTheme(theme) {
        var html = document.documentElement;
        if (theme === 'dark') {
            html.classList.add('dark-mode');
            themeToggle.checked = true;
            updateFavicon(true);
        } else {
            html.classList.remove('dark-mode');
            themeToggle.checked = false;
            updateFavicon(false);
        }
        localStorage.setItem('theme', theme);
    }

    function broadcastTheme(theme) {
        localStorage.setItem(
            'theme-sync',
            JSON.stringify({ theme: theme, timestamp: Date.now() })
        );
    }

    themeToggle.addEventListener('change', function () {
        var theme = themeToggle.checked ? 'dark' : 'light';
        applyTheme(theme);
        broadcastTheme(theme);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    window.addEventListener('storage', function (e) {
        if (e.key !== 'theme-sync' || !e.newValue) {
            return;
        }
        try {
            var data = JSON.parse(e.newValue);
            if (data && data.theme) {
                applyTheme(data.theme);
            }
        } catch (err) {
            console.error('Theme sync error:', err);
        }
    });

    applyTheme(getCurrentTheme());
});
