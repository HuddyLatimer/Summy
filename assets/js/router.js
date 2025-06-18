// Router functionality for clean URLs
const router = {
    init() {
        // Handle initial page load
        this.handleUrl();
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => this.handleUrl());
        
        // Handle all navigation links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.getAttribute('href').endsWith('.html')) {
                e.preventDefault();
                const cleanPath = link.getAttribute('href').replace('.html', '');
                this.navigate(cleanPath);
            }
        });
    },

    handleUrl() {
        let path = window.location.pathname;
        
        // Handle root path
        if (path === '/' || path === '') {
            path = '/index.html';
        }
        // Add .html if not present
        else if (!path.endsWith('.html')) {
            path = path + '.html';
        }

        // Load the page content
        fetch(path)
            .catch(err => {
                console.error('Navigation error:', err);
                window.location.href = path; // Fallback to normal navigation
            });
    },

    navigate(path) {
        // Update URL without .html extension
        window.history.pushState({}, '', path);
        this.handleUrl();
    }
};

// Initialize router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => router.init()); 