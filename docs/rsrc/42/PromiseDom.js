/**
 * 
 * PromiseDom v07
 * 
 * PromiseDom class provides a promise that resolves when the DOM is ready.
 * 
 */

class PromiseDom {
    /**
     * Initializes PromiseDom instance.
     * @param {Document} [document=window.document] The document object to use. Default is window.document.
     */
    constructor(document = window.document) {
        console.info('_42 / PromiseDom');
        this.ready = new Promise((resolve) => {
            const state = document.readyState;
            if (state === 'interactive' || state === 'complete') {
                resolve();
            } else {
                const onDOMContentLoaded = () => {
                    resolve();
                    document.removeEventListener('DOMContentLoaded', onDOMContentLoaded);
                };
                document.addEventListener('DOMContentLoaded', onDOMContentLoaded, false);
            }
        }).catch(error => {
            console.error('Error initializing PromiseDom:', error);
        });
    }
}

export default PromiseDom;
