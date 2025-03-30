document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    
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
            // Remove last-child styling that might be applied due to DOM position
            paper.classList.remove('last-visible');
        });
        
        // Show and reorder the filtered papers
        filteredPapers.forEach((paper, index) => {
            paper.classList.remove('hidden');
            // Detach and reattach to ensure proper DOM order
            papersList.appendChild(paper);
            
            // Only the last paper should have the last-visible class
            if (index === filteredPapers.length - 1) {
                paper.classList.add('last-visible');
            }
        });
    }
    
    // Initialize alphabetizing for initial state (all papers)
    alphabetizePapers('all');
    
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
});
