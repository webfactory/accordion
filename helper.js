import * as DOMPurify from 'dompurify';

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
 * Determine whether a given placeholder contains a heading as its only child
 *
 * @param {Element} placeholder
 * @returns {Element|Boolean} – The found heading element or false
 */
function _placeholderConsistsOfHeading(placeholder) {
    const hasHeading = Array.from(placeholder.children).filter((child) => {
        return child.nodeName.toLowerCase().match(/h[2-6]/);
    }).length > 0;
    const hasSingleChild = placeholder.childNodes.length === 1;

    return hasSingleChild && hasHeading ? placeholder.querySelector(':scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6') : false;
}

/**
 * Enhance a given placeholder element with a <button> for better keyboard support
 *
 * @param {Element} element – The accordion to be enhanced
 */
export function enhanceWithButton(element) {
    const header = element.querySelector('.js-accordion__header');
    const placeholder = element.querySelector('.js-accordion__trigger');
    const placeholderAttributes = getAttributes(placeholder);
    const placeholderHeading = _placeholderConsistsOfHeading(placeholder);

    // create button
    let trigger = document.createElement('button');

    // shift placeholder attributes to button
    for (const entry in placeholderAttributes) {
        trigger.setAttribute(entry, placeholderAttributes[entry]);
    }

    // ensure button is of type button to mitigate form submits if the accordion is nested in a form
    trigger.setAttribute('type', 'button');

    // if the placeholder consists of a heading (we allow h2-h6), we need to perform some DOM switcheroo
    // so the resulting HTML is valid (heading contains button contains childNodes formerly nested in heading)
    if (placeholderHeading) {
        // insert heading content into button
        trigger.innerHTML = DOMPurify.sanitize(placeholderHeading.innerHTML);

        // insert button into heading
        placeholderHeading.replaceChildren();
        placeholderHeading.append(trigger);

        // insert heading and button into header
        header.prepend(placeholderHeading);
    } else {
        // insert placeholder content into button
        trigger.innerHTML = DOMPurify.sanitize(placeholder.innerHTML);

        // insert button into header
        header.prepend(trigger);
    }

    placeholder.remove();
}
