import { defaultOptions } from '../../src/defaults';

/**
 * Checks wether an accordion is expanded
 *
 * @param {Element} accordion  the accordion to be checked
 * @param {Object} [options]
 * @return {Boolean}
 */
export function isExpanded(accordion, options) {
    const settings = {
            ...defaultOptions,
            ...options
        }
    const trigger = accordion.querySelector(settings.accordionTrigger);
    const panel = accordion.querySelector(settings.accordionPanel);

    return (trigger.getAttribute('aria-expanded') === 'true' && panel.getAttribute('aria-hidden') === 'false');
}


/**
 * Checks whether an accordion is collapsed
 *
 * @param {Element} accordion  the accordion to be checked
 * @param {Object} [options]
 * @return {Boolean}
 */
export function isCollapsed(accordion, options) {
    const settings = {
            ...defaultOptions,
            ...options
        }
    const trigger = accordion.querySelector(settings.accordionTrigger);
    const panel = accordion.querySelector(settings.accordionPanel);

    return (trigger.getAttribute('aria-expanded') === 'false' && panel.getAttribute('aria-hidden') === 'true');
}
