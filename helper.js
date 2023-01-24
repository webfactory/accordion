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
 * @param {Element} element
 * @returns {{}}
 * @private
 */
function _getAttributes(element) {
    return element.getAttributeNames().reduce((acc, name) => {
        return {...acc, [name]: element.getAttribute(name)};
    }, {});
}

/**
 * Strip all HTML attributes (and their values) from a given element
 * @param {Element} element
 * @private
 */
function _removeAllAttributes(element) {
    while(element.attributes.length > 0) {
        element.removeAttribute(element.attributes[0].name);
    }
}

/**
 * Determine whether a given placeholder contains a heading as its only child
 *
 * @param {Element} placeholder
 * @returns {Boolean}
 */
function _hasNestedHeading(placeholder) {
    const hasSingleDirectDescendant = placeholder.childNodes.length === 1;
    const containsAtLeastOneHeading = Array.from(placeholder.children).filter((child) => {
        return child.nodeName.toLowerCase().match(/h[2-6]/);
    }).length > 0;

    return hasSingleDirectDescendant && containsAtLeastOneHeading;
}

/**
 * Replace the placeholder element with a button that inherits all attributes
 *
 * @param {Element} placeholder
 * @returns {HTMLButtonElement}
 * @private
 */
function _replacePlaceholderWithButton(placeholder) {
    let trigger = _createButtonElementAndInheritAttributes(placeholder);

    // insert placeholder content into button
    trigger.innerHTML = DOMPurify.sanitize(placeholder.innerHTML);

    placeholder.remove();

    return trigger;
}

/**
 * Extract a nested heading from the placeholder, wrap a button around its children and replace the heading's
 * inner HTML with the button (the button inherits the headings attributes). Then remove the placeholder.
 *
 * @param {Element} placeholder
 * @returns {HTMLHeadingElement}
 * @private
 */
function _replacePlaceholderWithHeadingWrappedAroundButton(placeholder) {
    const heading = placeholder.querySelector(':scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6');
    const button = _createButtonElementAndInheritAttributes(placeholder)

    _insertButtonIntoHeading(heading, button);

    placeholder.remove();

    return heading;
}

/**
 * Take a heading, wrap a button around its children and replace the heading's inner HTML with the button.
 * The button inherits the headings attributes.
 *
 * @param {HTMLHeadingElement} heading
 * @param {HTMLButtonElement} button
 * @param {Object} [options]
 * @returns {HTMLHeadingElement}
 * @private
 */
function _insertButtonIntoHeading(heading, button, options) {
    // defaults
    options = options || { removeHeadingAttributes: false };

    // insert placeholder content into button
    button.innerHTML = DOMPurify.sanitize(heading.innerHTML);

    // insert button into cleaned heading
    if (options.removeHeadingAttributes) {
        _removeAllAttributes(heading);
    }
    heading.replaceChildren();
    heading.append(button);

    return heading;
}

/**
 * Create a button element and copy attributes from placeholder over to button
 *
 * @param {Element} placeholder
 * @returns {HTMLButtonElement}
 * @private
 */
function _createButtonElementAndInheritAttributes(placeholder) {
    const placeholderAttributes = _getAttributes(placeholder);

    // create button
    let button = document.createElement('button');

    // shift placeholder attributes to button
    for (const entry in placeholderAttributes) {
        button.setAttribute(entry, placeholderAttributes[entry]);
    }

    // ensure button is of type button to mitigate form submits if the accordion is nested in a form
    button.setAttribute('type', 'button');

    return button;
}

/**
 * Enhance a given placeholder element with a <button> for better keyboard support
 *
 * @param {Element} element – The accordion to be enhanced
 */
export function enhanceWithButton(element) {
    const header = element.querySelector('.js-accordion__header');
    const placeholder = element.querySelector('.js-accordion__trigger');
    const placeholderIsHeading = placeholder.nodeName.toLowerCase().match(/h[2-6]/);
    const placeholderContainsHeadingAsOnlyDirectDescendant = _hasNestedHeading(placeholder);
    let triggerElem;

    if (placeholderIsHeading) {
        const button = _createButtonElementAndInheritAttributes(placeholder);
        triggerElem = _insertButtonIntoHeading(placeholder, button, { removeHeadingAttributes: true });
    } else if (placeholderContainsHeadingAsOnlyDirectDescendant) {
        triggerElem = _replacePlaceholderWithHeadingWrappedAroundButton(placeholder);
    } else {
        triggerElem = _replacePlaceholderWithButton(placeholder);
    }

    header.prepend(triggerElem);
}
