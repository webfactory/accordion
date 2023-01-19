/**
 * Simulate a click event.
 * @public
 * @param {Element} elem  the element to simulate a click on
 */
export function simulateClick(elem) {
    // Create our event (with options)
    var evt = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    // If cancelled, don't dispatch our event
    var canceled = !elem.dispatchEvent(evt);
}

export default { simulateClick }
