document.addEventListener('DOMContentLoaded', function () {
    function paperTitleSortKey(li) {
        var clone = li.cloneNode(true);
        clone.querySelectorAll('a').forEach(function (a) {
            a.remove();
        });
        return clone.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
    }

    function alphabetizePapers() {
        var publishedSection = document.getElementById('published');
        if (!publishedSection) {
            return;
        }
        var papersList = publishedSection.querySelector('.papers-list');
        if (!papersList) {
            return;
        }
        var papers = Array.from(papersList.querySelectorAll('li.paper-item'));
        papers.sort(function (a, b) {
            return paperTitleSortKey(a).localeCompare(paperTitleSortKey(b));
        });
        papers.forEach(function (paper) {
            papersList.appendChild(paper);
        });
    }

    alphabetizePapers();

    var filterButtons = document.querySelectorAll('.filter-button');
    var paperItems = document.querySelectorAll('#published .paper-item');

    function updateLastVisibleItems() {
        var visibleItems = Array.from(paperItems).filter(function (item) {
            return !item.classList.contains('hidden');
        });
        paperItems.forEach(function (item) {
            item.classList.remove('last-visible');
        });
        if (visibleItems.length > 0) {
            visibleItems[visibleItems.length - 1].classList.add('last-visible');
        }
    }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            filterButtons.forEach(function (btn) {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            var filter = button.getAttribute('data-filter');
            paperItems.forEach(function (item) {
                if (filter === 'all') {
                    item.classList.remove('hidden');
                } else {
                    var categories = item.getAttribute('data-category').split(' ');
                    if (categories.indexOf(filter) !== -1) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                }
            });
            updateLastVisibleItems();
        });
    });

    updateLastVisibleItems();
});
