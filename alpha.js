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
    
    // Alphabetize papers function - specifically for the preprints/publications section
    function alphabetizePapers() {
        // Target only the papers-list within the published section
        const publishedSection = document.getElementById('published');
        if (!publishedSection) return;
        
        const papersList = publishedSection.querySelector('.papers-list');
        if (!papersList) return;
        
        const papers = Array.from(papersList.querySelectorAll('li.paper-item'));
        
        // Sort papers alphabetically by their text content
        papers.sort((a, b) => {
            // Get text content for comparison, excluding the [paper] or [preprint] link text
            const textA = a.childNodes[0].textContent.trim().toLowerCase();
            const textB = b.childNodes[0].textContent.trim().toLowerCase();
            return textA.localeCompare(textB);
        });
        
        // Clear the list and reappend the sorted papers
        while (papersList.firstChild) {
            papersList.removeChild(papersList.firstChild);
        }
        
        papers.forEach(paper => {
            papersList.appendChild(paper);
        });
    }
    
    // Run alphabetizing on page load
    alphabetizePapers();
    
    // Filter functionality - also just for the preprints/publications section
    const filterButtons = document.querySelectorAll('.filter-button');
    const paperItems = document.querySelectorAll('#published .paper-item');
    
    // Add click event listeners to all filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Show/hide papers based on filter
            paperItems.forEach(item => {
                if (filter === 'all') {
                    item.classList.remove('hidden');
                } else {
                    // Check if the item's categories include the selected filter
                    const categories = item.getAttribute('data-category').split(' ');
                    if (categories.includes(filter)) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                }
            });
            
            // Update the last-visible class for border styling
            updateLastVisibleItems();
        });
    });
    
    // Function to update the last-visible class for border styling
    function updateLastVisibleItems() {
        const visibleItems = Array.from(paperItems).filter(item => 
            !item.classList.contains('hidden')
        );
        
        // Remove the last-visible class from all items
        paperItems.forEach(item => {
            item.classList.remove('last-visible');
        });
        
        // Add the last-visible class to the last visible item
        if (visibleItems.length > 0) {
            visibleItems[visibleItems.length - 1].classList.add('last-visible');
        }
    }
    
    // Initialize filters and last-visible class on page load
    updateLastVisibleItems();
});
