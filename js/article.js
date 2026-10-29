document.addEventListener('DOMContentLoaded', function () {
    var article = document.querySelector('.article-prose');
    var layout = document.querySelector('.article-layout');
    var leftRail = document.querySelector('[data-sidenotes="left"]');
    var rightRail = document.querySelector('[data-sidenotes="right"]');

    function copyText(text, button) {
        if (!navigator.clipboard) {
            return;
        }
        navigator.clipboard.writeText(text).then(function () {
            var original = button.querySelector('span:first-child');
            if (!original) {
                original = button;
            }
            var label = original.textContent;
            original.textContent = 'Copied';
            window.setTimeout(function () {
                original.textContent = label;
            }, 1500);
        });
    }

    var shareButton = document.querySelector('[data-share-article]');
    if (shareButton) {
        shareButton.addEventListener('click', function () {
            var shareData = { title: document.title, url: window.location.href };
            if (navigator.share) {
                navigator.share(shareData).catch(function () {});
            } else {
                copyText(window.location.href, shareButton);
            }
        });
    }

    var urlButton = document.querySelector('[data-copy-url]');
    if (urlButton) {
        urlButton.addEventListener('click', function () {
            copyText(document.querySelector('link[rel="canonical"]').href, urlButton);
        });
    }

    var citationButton = document.querySelector('[data-copy-citation]');
    if (citationButton) {
        citationButton.addEventListener('click', function () {
            var citation = document.querySelector('[data-article-citation]');
            copyText(citation.textContent.trim(), citationButton);
        });
    }

    if (!article || !layout || !leftRail || !rightRail) {
        return;
    }

    function buildSidenotes() {
        leftRail.innerHTML = '';
        rightRail.innerHTML = '';

        if (window.innerWidth < 1120) {
            return;
        }

        article.querySelectorAll('sup[id^="ref-"]').forEach(function (reference) {
            var number = reference.id.replace('ref-', '');
            var note = document.getElementById('note-' + number);
            if (!note) {
                return;
            }

            var sidenote = document.createElement('div');
            sidenote.className = 'sidenote';
            sidenote.dataset.reference = reference.id;

            var marker = document.createElement('span');
            marker.className = 'sidenote-number';
            marker.textContent = number;

            var content = note.querySelector('span').cloneNode(true);
            content.querySelectorAll('a').forEach(function (link) {
                link.remove();
            });

            sidenote.appendChild(marker);
            sidenote.appendChild(content);
            (Number(number) % 2 ? leftRail : rightRail).appendChild(sidenote);
        });

        window.requestAnimationFrame(positionSidenotes);
    }

    function positionRail(rail) {
        var layoutTop = layout.getBoundingClientRect().top;
        var nextTop = 0;

        rail.querySelectorAll('.sidenote').forEach(function (sidenote) {
            var reference = document.getElementById(sidenote.dataset.reference);
            var desiredTop = reference.getBoundingClientRect().top - layoutTop - 2;
            var top = Math.max(desiredTop, nextTop);
            sidenote.style.top = top + 'px';
            nextTop = top + sidenote.offsetHeight + 18;
        });
    }

    function positionSidenotes() {
        if (window.innerWidth < 1120) {
            return;
        }
        positionRail(leftRail);
        positionRail(rightRail);
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(buildSidenotes, 120);
    });

    buildSidenotes();
    window.addEventListener('load', positionSidenotes);
});
