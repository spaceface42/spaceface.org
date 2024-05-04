class PromiseDom {
    /**
     * Initializes PromiseDom instance.
     * @param document The document object to use. Default is window.document.
     */
    constructor(document = window.document) {
        this.document = document;
        console.info('_42 / PromiseDom');
        this.ready = new Promise((resolve, reject) => {
            try {
                const state = this.document.readyState;
                if (state === 'interactive' || state === 'complete') {
                    resolve();
                }
                else {
                    this.document.addEventListener('DOMContentLoaded', () => resolve(), false);
                }
            }
            catch (error) {
                console.error('Error initializing PromiseDom:', error);
                reject(new Error('Failed to initialize PromiseDom'));
            }
        });
    }
}
export default PromiseDom;
//# sourceMappingURL=PromiseDom.js.map