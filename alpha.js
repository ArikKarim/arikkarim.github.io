document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');

    // Retrieve the saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        themeToggle.checked = true;  // Ensure the toggle is in the correct position
    } else {
        document.documentElement.classList.remove('dark-mode');
        themeToggle.checked = false;
    }

    themeToggle.addEventListener('change', function() {
        const theme = this.checked ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark-mode', this.checked);
        localStorage.setItem('theme', theme);

        // Sync theme with other open pages
        localStorage.setItem('theme-sync', JSON.stringify({
            theme: theme,
            timestamp: new Date().getTime()
        }));
    });

    // Enhanced Filter functionality with alphabetizing
    const filterButtons = document.querySelectorAll('.filter-button');
    const papersList = document.querySelector('.papers-list');
    const paperItems = document.querySelectorAll('.paper-item');

    // Function to update the last-visible class
    function updateLastVisible() {
        paperItems.forEach(item => item.classList.remove('last-visible'));
        const visibleItems = Array.from(paperItems).filter(item => !item.classList.contains('hidden'));
        if (visibleItems.length > 0) {
            visibleItems[visibleItems.length - 1].classList.add('last-visible');
        }
    }

    // Function to alphabetize papers based on current filter
    function alphabetizePapers(filter) {
        const papers = Array.from(paperItems);
        let filteredPapers = (filter === 'all') ? papers : papers.filter(paper => paper.getAttribute('data-category').split(' ').includes(filter));
        
        filteredPapers.sort((a, b) => {
            const textA = a.childNodes[0].textContent.trim().toLowerCase();
            const textB = b.childNodes[0].textContent.trim().toLowerCase();
            return textA.localeCompare(textB);
        });
        
        papers.forEach(paper => {
            paper.classList.add('hidden');
            paper.classList.remove('last-visible');
        });
        
        filteredPapers.forEach((paper, index) => {
            paper.classList.remove('hidden');
            papersList.appendChild(paper);
            if (index === filteredPapers.length - 1) {
                paper.classList.add('last-visible');
            }
        });
    }

    // Initialize alphabetizing for initial state (all papers)
    alphabetizePapers('all');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            alphabetizePapers(this.getAttribute('data-filter'));
        });
    });
});
