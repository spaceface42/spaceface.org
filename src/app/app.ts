/**
 * startup
 */
import PromiseDom from '../42/PromiseDom.js'
import FetchPartial from '../42/FetchPartial.js'



// Instantiate FetchPartial
const fetchPartial = new FetchPartial();

// Instantiate PromiseDom
const promiseDom = new PromiseDom();




// Use PromiseDom to wait for DOM ready state
promiseDom.ready.then(() => {



    // Once the DOM is ready, perform fetch operations

    // Example usage of fetchOne
    /*
    const linkElement = document.querySelector('link[rel="manualhtml"]');
    if (linkElement && linkElement instanceof HTMLLinkElement) {
        fetchPartial.fetchOne(undefined, linkElement)
            .then(() => console.log('FetchOne completed'))
            .catch(error => console.error('Error during fetching partial / fetchOne:', error));
    }
    */

    // Example usage of fetchAll
    fetchPartial.fetchAll()
        .then(() => console.log('FetchAll completed'))
        .catch(error => console.error('Error during fetching partial / fetchAll:', error));

    // call startup function
    startup();

});




/**
 * this function is responsible to set up ux
 */
function startup() {

    const options = {
        root: null,
        threshold: 0.30,
        rootMargin: "-30% 0% -30% 0%"
    };

    // Define the IntersectionObserver before using it
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {

        /*
            if (!entry.isIntersecting) {
                console.error('NOT!!!!!!!!');
                console.log(entry.target);
                // entry.target.classList.toggle('visible');
                return;
            }
            
            console.log(entry.target);
            entry.target.classList.toggle('visible');
          
           if (!entry.isIntersecting) {
                return;
           }
           entry.target.classList.toggle('visible');

*/

           //observer.unobserve(entry.target); //!!!!!!!!!



            if (entry.isIntersecting && entry.target) {

                // Add 'visible' class when code tag is in viewport
                entry.target.classList.add('visible');
                console.info('Element with class "partial" is now visible:');
                console.log(entry);
                console.log(entry.target);
                console.log(entry.intersectionRatio);
                // entry.target.classList.toggle('toggle');

                // if (entry.intersectionRatio >= 0.5) {
                    // do something
                // }

            } else {
                // Remove 'visible' class when code tag is not in viewport
                entry.target.classList.remove('visible');
                // console.log('Element with class "partial" is now invisible:');
            }



        });
    }, options);

    const handleDomChanges = (mutationsList: MutationRecord[]) => {
        mutationsList.forEach(mutation => {
            mutation.addedNodes.forEach(addedNode => {
                // If the added node is a <code> element with the class "partial", observe it with IntersectionObserver
                if (addedNode instanceof HTMLElement && addedNode.tagName === 'ARTICLE' && addedNode.classList.contains('partial')) {
                    observer.observe(addedNode);
                }
            });
        });
    };

    const mutationObserver = new MutationObserver(handleDomChanges);
    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}


