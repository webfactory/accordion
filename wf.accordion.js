import {slugify, setUrlHash, triggerIdMatchesUrlHash, removeUrlHash, getUrlHash, enhanceWithButton} from "./helper";

/**
 * Create a counter (used a for creation of unique IDs)
 *
 * @type {number}
 */
window.wfaccordion = window.wfaccordion || {};
window.wfaccordion.groups = window.wfaccordion.groups || [];
window.wfaccordion.slugs = window.wfaccordion.slugs || [];

class wfaccordion {
    constructor(elem, options) {
        this.settings = {
            ...{
                accordionHeader: '.js-accordion__header',
                accordionTrigger: '.js-accordion__trigger',
                enhancedAccordionTrigger: 'button.js-accordion__trigger',
                accordionPanel: '.js-accordion__panel',
                disableHashUpdate: false
            },
            ...options
        }
        this.root = elem;
        this.panel = this.root.querySelector(this.settings.accordionPanel);
        this.placeholder = this.root.querySelector(this.settings.accordionTrigger);
        this.slug = this.root.getAttribute('id') || slugify(this.placeholder.textContent);
        this.slugOccurence = window.wfaccordion.slugs.filter((slug, index) => {
            return slug.indexOf(this.slug) >= 0
        }).length;

        if (!window.wfaccordion.slugs.includes(this.slug)) {
            window.wfaccordion.slugs.push(this.slug);
            this.headerID = this.slug;
            this.panelID = this.slug + '-panel';
        } else {
            window.wfaccordion.slugs.push(this.slug + '-' + this.slugOccurence);
            this.headerID = this.slug + '-' + this.slugOccurence;
            this.panelID = this.slug + '-panel' + '-' + this.slugOccurence;
        }

        enhanceWithButton(this.root);
        this.trigger = this.root.querySelector(this.settings.enhancedAccordionTrigger);

        this.events();

        // Prevent duplicated IDs on root and header element
        this.root.removeAttribute('id');

        // Create ARIA relationships between headers and panels
        this.trigger.setAttribute('aria-controls', this.panelID);
        this.panel.setAttribute('id', this.panelID);

        this.trigger.setAttribute('id', this.headerID);
        this.panel.setAttribute('aria-labelledby', this.headerID);

        // Get initial state
        this.isDisabled = this.root.hasAttribute('data-wf-accordion-disabled');
        this.isTargetOfUrlHash = triggerIdMatchesUrlHash(this.trigger);
        this.isExpandedOnStartup = this.root.hasAttribute('data-wf-accordion-expanded') || this.isTargetOfUrlHash;

        // Set initial state
        this.trigger.setAttribute('aria-disabled', this.isDisabled);
        this.trigger.setAttribute('aria-expanded', this.isExpandedOnStartup);
        this.panel.setAttribute('aria-hidden', !this.isExpandedOnStartup);

        if (this.isTargetOfUrlHash) {
            this.trigger.focus()
        }

    }

    events() {

        // Update ARIA states on click/tap
        this.trigger.addEventListener('click', (event) => {
            const target = event.target.closest('button');
            const state = target.getAttribute('aria-expanded') === 'false';

            if (!this.isDisabled) {
                target.setAttribute('aria-expanded', state);
                this.root.querySelector('#' + target.getAttribute('aria-controls')).setAttribute('aria-hidden', !state)
            }

            // Update URL with hash when an accordion expands
            if (!this.settings.disableHashUpdate) {
                if (target.getAttribute('aria-expanded') === 'true' && this.headerID !== getUrlHash()) {
                    setUrlHash(this.headerID);
                } else if (target.getAttribute('aria-expanded') === 'false' && this.headerID === getUrlHash()) {
                    removeUrlHash();
                }
            }
        });
    }
}

class wfaccordionGroup {
    constructor(elem, options) {
        this.group = elem;
        this.settings = {
            ...{
                accordionGroup: '.js-accordion-group',
                accordionRoot: '.js-accordion',
                disableHashUpdate: false
            },
            ...options
        };
        this.accordions = Array.from(this.group.querySelectorAll(this.settings.accordionRoot)).map((root) => {
            return new wfaccordion(root);
        });
        this.accordionTrigger = this.accordions.map((accordion) => {
            return accordion.trigger
        });
        this.events();
    }

    events() {

        // Enable keyboard support
        this.group.addEventListener('keydown', (event) => {
            const target = event.target;
            const key = event.which.toString();

            // 33 = Page Up, 34 = Page Down
            const ctrlModifier = (event.ctrlKey && key.match(/33|34/));

            // Support up / down arrows as well as Ctrl + Page Up / Page Down keys
            // 38 = Up, 40 = Down
            if (key.match(/38|40/) || ctrlModifier) {
                const index = this.accordionTrigger.indexOf(target);
                const direction = (key.match(/34|40/)) ? 1 : -1;
                const length = this.accordionTrigger.length;
                const newIndex = (index + length + direction) % length;

                this.accordionTrigger[newIndex].focus();

                event.preventDefault();
            } else if (key.match(/35|36/)) {
                // Support End and Home keys
                // 35 = End, 36 = Home
                switch (key) {
                    // Focus the first accordion
                    case '36':
                        this.accordionTrigger[0].focus();
                        break;
                    // Focus the last accordion
                    case '35':
                        this.accordionTrigger[this.accordionTrigger.length - 1].focus();
                        break;
                }
                event.preventDefault();
            }
        });
    }
}

export const wfaccordionsInit = (options, initCallback) => {
    const wfaccordionGroups = Array.from(document.querySelectorAll('.js-accordion-group'));

    window.addEventListener('wf.accordions.mounted', (event) => {
        if (initCallback) {
            initCallback(event);
        }
    });

    wfaccordionGroups.forEach((group, index) => {
        window.wfaccordion.groups.push(new wfaccordionGroup(group, options || {}));

        // Throw event when the last accordion group was processed (and DOM manipulations are done)
        if (index === wfaccordionGroups.length - 1) {
            window.dispatchEvent(new CustomEvent('wf.accordions.mounted', {
                bubbles: true,
                cancelable: true,
                detail: window.wfaccordion
            }));
        }
    });
}
