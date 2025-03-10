/**
 * HTMLFragmentFetcher v1
 *
    // Usage Example:
    // import HTMLFragmentFetcher from "./HTMLFragmentFetcher.js";
    // const fetcher = new HTMLFragmentFetcher();
    // fetcher.fetchAll();
    // fetcher.watch();
    // fetcher.observeLinks();
 *
 */
class HTMLFragmentFetcher {
    constructor() {
        this.cache = new Map();
        this.processedLinks = new WeakSet();
    }

    async fetchAndReplace(link) {
        const url = link.getAttribute('href');
        if (!url) {
            console.error('Missing href attribute on <link rel="include" />');
            return;
        }
    
        if (this.cache.has(url)) {
            const clone = this.cache.get(url).cloneNode(true);
            link.replaceWith(clone);
            document.dispatchEvent(new CustomEvent("htmlFragmentLoaded", {
                detail: { id: url } // Include the ID in the event's detail
            }));
            return;
        }
    
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const html = await response.text();
            const fragment = document.createRange().createContextualFragment(html);
            link.replaceWith(fragment);
    
            // Dispatch the event with the fragment ID
            document.dispatchEvent(new CustomEvent("htmlFragmentLoaded", {
                detail: { id: url } // Include the URL (or any other identifier) in the event's detail
            }));
        } catch (error) {
            console.error("Error loading HTML fragment:", error);
        }
    }
    
    
    fetchAll() {
        document.querySelectorAll('link[rel="include"]').forEach(link => {
            if (!this.processedLinks.has(link)) {
                this.fetchAndReplace(link);
                this.processedLinks.add(link);
            }
        });
    }

    observeLinks() {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.fetchAndReplace(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        });

        document.querySelectorAll('link[rel="include"]').forEach(link => observer.observe(link));
    }

    watch() {
        const observer = new MutationObserver(() => this.fetchAll());
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

export default HTMLFragmentFetcher;
