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
