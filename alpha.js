document.addEventListener('DOMContentLoaded', function () {
    // Select the theme toggle switch
    const themeToggle = document.getElementById('theme-toggle');

    // Function to get the current theme from localStorage or system preference
    function getCurrentTheme() {
        return localStorage.getItem('theme') || 
               (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }

    // Function to apply the theme and update the toggle position
    function applyTheme(theme) {
        document.documentElement.classList.toggle('dark-mode', theme === 'dark');
        if (themeToggle) {
            themeToggle.checked = (theme === 'dark');
        }
    }

    // Initialize theme on page load
    const savedTheme = getCurrentTheme();
    applyTheme(savedTheme);

    // Toggle theme on switch change
    if (themeToggle) {
        themeToggle.addEventListener('change', function () {
            const newTheme = this.checked ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);

            // Sync theme with other open pages
            localStorage.setItem('theme-sync', JSON.stringify({
                theme: newTheme,
                timestamp: new Date().getTime()
            }));
        });
    }

    // Sync theme changes across multiple open tabs
    window.addEventListener('storage', function (event) {
        if (event.key === 'theme-sync') {
            const data = JSON.parse(event.newValue);
            applyTheme(data.theme);
        }
    });
});

// Enhanced Filter functionality with alphabetizing
const filterButtons = document.querySelectorAll('.filter-button');
const papersList = document.querySelector('.papers-list');
const paperItems = document.querySelectorAll('.paper-item');

// Function to update the last-visible class
function updateLastVisible() {
    // Remove last-visible class from all items
    paperItems.forEach(item => {
        item.classList.remove('last-visible');
    });

    // Get all visible items
    const visibleItems = Array.from(paperItems).filter(item => !item.classList.contains('hidden'));

    // Add last-visible class to the last visible item
    if (visibleItems.length > 0) {
        visibleItems[visibleItems.length - 1].classList.add('last-visible');
    }
}

// Function to alphabetize papers based on current filter
function alphabetizePapers(filter) {
    // Get all papers
    const papers = Array.from(paperItems);

    // Filter papers based on selected category
    let filteredPapers = papers;
    if (filter !== 'all') {
        filteredPapers = papers.filter(paper => {
            const categories = paper.getAttribute('data-category').split(' ');
            return categories.includes(filter);
        });
    }

    // Sort the filtered papers alphabetically by title text
    filteredPapers.sort((a, b) => {
        const textA = a.childNodes[0].textContent.trim().toLowerCase();
        const textB = b.childNodes[0].textContent.trim().toLowerCase();
        return textA.localeCompare(textB);
    });

    // Hide all papers first
    papers.forEach(paper => {
        paper.classList.add('hidden');
    });

    // Show and reorder the filtered papers
    filteredPapers.forEach(paper => {
        paper.classList.remove('hidden');
        papersList.appendChild(paper);
    });

    // Update last-visible status
    updateLastVisible();
}

// Initialize alphabetizing for initial state (all papers)
alphabetizePapers('all');

// Add event listeners for each filter button
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');

        // Apply alphabetizing with the selected filter
        alphabetizePapers(filter);
    });
});
