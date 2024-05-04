/**
 * startup
 */
import PromiseDom from '../42/PromiseDom.js';
import FetchPartial from '../42/FetchPartial.js';
// Instantiate FetchPartial
const fetchPartial = new FetchPartial();
// Instantiate PromiseDom
const promiseDom = new PromiseDom();
// Use PromiseDom to wait for DOM ready state
promiseDom.ready.then(() => {
    // Once the DOM is ready, perform fetch operations
    // Example usage of fetchOne
    const linkElement = document.querySelector('link[rel="html"]');
    if (linkElement && linkElement instanceof HTMLLinkElement) { // Check if linkElement is of type HTMLLinkElement
        fetchPartial.fetchOne(undefined, linkElement)
            .then(() => console.log('FetchOne completed'))
            .catch(error => console.error('Error during fetchOne:', error));
    }
    // Example usage of fetchAll
    fetchPartial.fetchAll()
        .then(() => console.log('FetchAll completed'))
        .catch(error => console.error('Error during fetchAll:', error));
    observethis();
});
let addedNodeCount = 0; // Declare addedNodeCount variable here
function observethis() {
    // Create a new FetchPartial instance
    // const fetchPartial = new FetchPartial();
    // Define a function to handle changes to the DOM
    const handleDomChanges = (mutationsList) => {
        // console.log('11111');
        mutationsList.forEach(mutation => {
            // console.log('22222');
            mutation.addedNodes.forEach(addedNode => {
                // console.log('33333');
                addedNodeCount++;
                // Check if the added node is a fetched tag
                // if (addedNode instanceof HTMLLinkElement && addedNode.getAttribute('class') === 'partial') {
                if (addedNode instanceof HTMLElement && addedNode.tagName === 'CODE' && addedNode.classList.contains('partial')) {
                    // console.log('44444');
                    console.log('partial no.', addedNodeCount);
                    // Fetch the content of the added tag
                    //const url = addedNode.getAttribute('href');
                    //if (url) {
                    //    fetchPartial.fetch(url, addedNode);
                    //}
                }
            });
        });
    };
    // Create a Mutation Observer instance
    const mutationObserver = new MutationObserver(handleDomChanges);
    // Start observing changes to the DOM
    mutationObserver.observe(document.body, {
        childList: true, // Watch for changes to the child nodes of the body
        subtree: true // Watch for changes in the entire subtree of the body
    });
    const target = document.getElementsByClassName('partial');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && entry.target) {
                // When the target element becomes visible, do something
                console.log('Element with class "partial" is now visible:', entry.target);
                // Stop observing the element to avoid unnecessary callbacks
                observer.unobserve(entry.target);
            }
        });
    });
    // Observe each element with class 'partial'
    for (let i = 0; i < target.length; i++) {
        observer.observe(target[i]); // Type assertion to ensure entry.target is of type Element
    }
}
//# sourceMappingURL=app%20copy.js.map