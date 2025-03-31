document.addEventListener('DOMContentLoaded', function () {
    // Theme toggle functionality (keeping your existing code)
    const themeToggle = document.getElementById('theme-toggle');
    
    function getCurrentTheme() {
        return localStorage.getItem('theme') || 
               (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    
    function applyTheme(theme) {
        document.documentElement.classList.toggle('dark-mode', theme === 'dark');
        if (themeToggle) {
            themeToggle.checked = (theme === 'dark');
        }
    }
    
    const savedTheme = getCurrentTheme();
    applyTheme(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('change', function () {
            const newTheme = this.checked ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            localStorage.setItem('theme-sync', JSON.stringify({
                theme: newTheme,
                timestamp: new Date().getTime()
            }));
        });
    }
    
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
        
        // Reappend sorted papers to the list
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
            
            // Update dividers after filtering
            updateDividers();
        });
    });
    
    // Function to update dividers for proper styling
    function updateDividers() {
        // First, reset all papers to have bottom borders
        paperItems.forEach(item => {
            item.style.borderBottom = '1px solid var(--border-color)';
            // Also add top border for all items
            item.style.borderTop = '1px solid var(--border-color)';
            // Remove the border from the first visible item's top
            item.classList.remove('last-visible');
        });
        
        // Find all visible items
        const visibleItems = Array.from(paperItems).filter(item => 
            !item.classList.contains('hidden')
        );
        
        // Remove top border from the first visible item
        if (visibleItems.length > 0) {
            visibleItems[0].style.borderTop = 'none';
        }
        
        // Remove bottom border from the last visible item
        if (visibleItems.length > 0) {
            visibleItems[visibleItems.length - 1].style.borderBottom = 'none';
            visibleItems[visibleItems.length - 1].classList.add('last-visible');
        }
    }
    
    // Initialize dividers on page load
    updateDividers();
});
