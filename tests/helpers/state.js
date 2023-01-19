/**
 * Checks wether an accordion is expanded
 *
 * @param {Element} accordion  the accordion to be checked
 */
export function isExpanded(accordion) {
    const trigger = accordion.querySelector('.js-accordion__trigger');
    const panel = accordion.querySelector('.js-accordion__panel');

    return (trigger.getAttribute('aria-expanded') === 'true' && panel.getAttribute('aria-hidden') === 'false');
}

/**
 * Checks wether an accordion is collapsed
 *
 * @param {Element} accordion  the accordion to be checked
 */
export function isCollapsed(accordion) {
    const trigger = accordion.querySelector('.js-accordion__trigger');
    const panel = accordion.querySelector('.js-accordion__panel');

    return (trigger.getAttribute('aria-expanded') === 'false' && panel.getAttribute('aria-hidden') === 'true');
}
