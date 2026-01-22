// Smooth scroll with offset for fixed header
document.addEventListener('DOMContentLoaded', function () {
    // Handle all anchor links
    // Handle all anchor links, including those starting with /#
    document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            let href = this.getAttribute('href');

            // Handle /# links
            if (href.startsWith('/#')) {
                // If we are NOT on the homepage, let the browser navigate
                if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
                    return;
                }
                // If on homepage, treat as local anchor
                href = href.substring(1); // Remove leading slash, becomes #id
            }

            // Skip if it's just "#" or empty
            if (!href || href === '#') return;

            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = 100; // Fixed header height + padding
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL hash without jump
                history.pushState(null, null, '#' + targetId);
            }
        });
    });

    // Handle links that navigate to main page with anchors (for project pages)
    document.querySelectorAll('a[href*="/#"]').forEach(anchor => {
        const href = anchor.getAttribute('href');

        // If we're on a project page and clicking a main page anchor
        if (window.location.pathname !== '/' && href.includes('/#')) {
            // Let the browser handle navigation to main page
            // The scroll offset will be handled after page load
            return;
        }
    });

    // Handle initial scroll on page load if there's a hash
    if (window.location.hash) {
        setTimeout(() => {
            const targetId = window.location.hash.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
});
