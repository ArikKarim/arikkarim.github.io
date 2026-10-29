document.addEventListener('DOMContentLoaded', function () {
    function copyText(text, button) {
        if (!navigator.clipboard) {
            return;
        }

        navigator.clipboard.writeText(text).then(function () {
            var labelElement = button.querySelector('span:first-child') || button;
            var label = labelElement.textContent;
            labelElement.textContent = 'Copied';
            window.setTimeout(function () {
                labelElement.textContent = label;
            }, 1500);
        });
    }

    var canonical = document.querySelector('link[rel="canonical"]');
    var articleUrl = canonical ? canonical.href : window.location.href;
    var shareButton = document.querySelector('[data-share-article]');

    if (shareButton) {
        shareButton.addEventListener('click', function () {
            var shareData = { title: document.title, url: articleUrl };
            if (navigator.share) {
                navigator.share(shareData).catch(function () {});
            } else {
                copyText(articleUrl, shareButton);
            }
        });
    }

    var urlButton = document.querySelector('[data-copy-url]');
    if (urlButton) {
        urlButton.addEventListener('click', function () {
            copyText(articleUrl, urlButton);
        });
    }

    var citationButton = document.querySelector('[data-copy-citation]');
    if (citationButton) {
        citationButton.addEventListener('click', function () {
            var citation = document.querySelector('[data-article-citation]');
            copyText(citation.textContent.trim(), citationButton);
        });
    }

    var contentsLinks = Array.from(document.querySelectorAll('.article-contents a[href^="#"]'));
    var sections = contentsLinks.map(function (link) {
        return document.querySelector(link.getAttribute('href'));
    }).filter(Boolean);

    function updateActiveSection() {
        if (!sections.length) {
            return;
        }

        var threshold = Math.max(120, window.innerHeight * 0.24);
        var active = sections[0];
        sections.forEach(function (section) {
            if (section.getBoundingClientRect().top <= threshold) {
                active = section;
            }
        });

        contentsLinks.forEach(function (link) {
            var isActive = link.getAttribute('href') === '#' + active.id;
            link.classList.toggle('is-active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    var scrollTicking = false;
    window.addEventListener('scroll', function () {
        if (scrollTicking) {
            return;
        }
        scrollTicking = true;
        window.requestAnimationFrame(function () {
            updateActiveSection();
            scrollTicking = false;
        });
    }, { passive: true });

    updateActiveSection();
});
