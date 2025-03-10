class DomObserver {
    /**
     * Waits for the DOM to be fully loaded
     * @returns {Promise<Document>} Resolves with the document when DOM is ready
     */
    static onDomLoaded() {
        return new Promise(resolve => {
            if (document.readyState === "complete" || document.readyState === "interactive") {
                resolve(document);
                return;
            }
            document.addEventListener("DOMContentLoaded", () => resolve(document), { once: true });
        });
    }

    /**
     * Waits for all fragments to be loaded (no link[rel='include'] elements remaining)
     * @param {number} timeout - Maximum wait time in milliseconds
     * @returns {Promise<void>} Resolves when all fragments are loaded
     */
    static async onFragmentsLoaded(timeout = 10000) {
        await this.onDomLoaded();
        
        if (document.querySelectorAll("link[rel='include']").length === 0) {
            return;
        }

        return this._createObserverPromise(
            () => document.querySelectorAll("link[rel='include']").length === 0,
            timeout,
            'Fragment loading timed out'
        );
    }
    
    /**
     * Waits for specific fragments to be loaded
     * @param {string[]} fragmentIds - Array of fragment IDs to wait for
     * @param {number} timeout - Maximum wait time in milliseconds
     * @returns {Promise<void>} Resolves when all specified fragments are loaded
     */
    static async onSpecificFragmentsLoaded(fragmentIds, timeout = 10000) {
        if (!Array.isArray(fragmentIds) || fragmentIds.length === 0) {
            throw new Error('fragmentIds must be a non-empty array');
        }
        
        await this.onDomLoaded();
        
        const pendingFragments = new Set(fragmentIds);
        this._checkSpecificFragments(pendingFragments);
        if (pendingFragments.size === 0) {
            return;
        }
        
        return this._createObserverPromise(
            () => {
                this._checkSpecificFragments(pendingFragments);
                return pendingFragments.size === 0;
            },
            timeout,
            `Fragments loading timed out. Still pending: ${Array.from(pendingFragments).join(', ')}`
        );
    }
    
    /**
     * Helper method to check for specific fragments and remove them from the pending set
     * @private
     * @param {Set<string>} pendingFragments - Set of fragment IDs to check
     */
    static _checkSpecificFragments(pendingFragments) {
        pendingFragments.forEach(id => {
            if (document.querySelector(`[data-fragment-id='${id}']`)) {
                pendingFragments.delete(id);
            }
        });
    }
    
    /**
     * Creates a promise with a mutation observer that resolves when a condition is met
     * @private
     * @param {Function} condition - Function that returns true when the promise should resolve
     * @param {number} timeout - Maximum wait time in milliseconds
     * @param {string} timeoutMessage - Error message if timeout occurs
     * @returns {Promise<void>} Resolves when condition is met
     */
    static _createObserverPromise(condition, timeout, timeoutMessage) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                observer.disconnect();
                reject(new Error(timeoutMessage));
            }, timeout);

            const checkCondition = () => {
                if (condition()) {
                    clearTimeout(timer);
                    observer.disconnect();
                    resolve();
                }
            };

            const observer = new MutationObserver(() => {
                try {
                    checkCondition();
                } finally {
                    if (condition()) observer.disconnect();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
            checkCondition();
        });
    }
}

export default DomObserver;
