/**
 * Returns the loaction hash minus the hash-symbol
 * @returns {string}
 */
export function getUrlHash() {
    return window.location.hash.replace('#', '');
}

/**
 * Use history.replaceState so clicking through accordions
 * does not create dozens of new history entries.
 * Browser back should navigate to the previous page
 * regardless of how many accordions were activated.
 *
 * @param {string} hash
 */
export function setUrlHash( hash ) {
    if (history.replaceState) {
        history.replaceState(null, '', '#' + hash);
    } else {
        location.hash = hash;
    }
}

/**
 * Use history.replaceState so clicking through accordions
 * does not create dozens of new history entries.
 * Browser back should navigate to the previous page
 * regardless of how many accordions were activated.
 */
export function removeUrlHash() {
    if (history.replaceState) {
        history.replaceState(null, '', ' ');
    }
}

/**
 * Create a slug from any string.
 * https://gist.github.com/hagemann/382adfc57adbd5af078dc93feef01fe1
 *
 * @type {string}
 */
export function slugify(string) {
    var a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;';
    var b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------';
    var p = new RegExp(a.split('').join('|'), 'g');

    return string.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, function(c) { return b.charAt(a.indexOf(c)); }) // Replace special characters
        .replace(/&/g, '-') // Replace & with '-'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}

/**
 * Check if Accordion is targeted by URL hash
 *
 * @param triggerElement
 * @returns {boolean}
 */
export function triggerIdMatchesUrlHash(triggerElement) {
    return triggerElement.getAttribute('id') === getUrlHash();
}


/**
 * Return all HTML attributes (and their values) of a given element
 * @param element
 * @returns {{}}
 */
export function getAttributes(element) {
    return element.getAttributeNames().reduce((acc, name) => {
        return {...acc, [name]: element.getAttribute(name)};
    }, {});
}

/**
 * Strip all HTML attributes (and their values) from a given element
 * @param element
 */
export function removeAllAttributes(element) {
    while(element.attributes.length > 0) {
        element.removeAttribute(element.attributes[0].name);
    }
}

export default {getUrlHash, setUrlHash, removeUrlHash, slugify, triggerIdMatchesUrlHash, getAttributes, removeAllAttributes};