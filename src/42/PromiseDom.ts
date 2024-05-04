/**
 * 
 * PromiseDom v07
 * 
 * PromiseDom class provides a promise that resolves when the DOM is ready.
 * 
 */
type DocumentReadyState = 'loading' | 'interactive' | 'complete';

class PromiseDom {
    ready: Promise<void>;

    /**
     * Initializes PromiseDom instance.
     * @param document The document object to use. Default is window.document.
     */
    constructor(private document: Document = window.document) {
        console.info('_42 / PromiseDom');
        this.ready = new Promise<void>((resolve, reject) => {
            try {
                const state: DocumentReadyState = this.document.readyState;
                if (state === 'interactive' || state === 'complete') {
                    resolve();
                } else {
                    this.document.addEventListener('DOMContentLoaded', () => resolve(), false);
                }
            } catch (error) {
                console.error('Error initializing PromiseDom:', error);
                reject(new Error('Failed to initialize PromiseDom'));
            }
        });
    }
}

export default PromiseDom;
