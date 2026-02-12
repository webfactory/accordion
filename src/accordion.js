import {defaultOptions} from './defaults';
import {htmlid, setUrlHash, removeUrlHash, getUrlHash, enhanceWithButton} from "./helper";

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
            ...defaultOptions,
            ...options
        }
        this.root = elem;
        this.panel = this.root.querySelector(this.settings.accordionPanel);
        this.placeholder = this.root.querySelector(this.settings.accordionTrigger);
        this.slug = this.root.getAttribute('id') || htmlid(this.placeholder.textContent);
        this.slugOccurence = window.wfaccordion.slugs.filter((slug, index) => {
            return slug.indexOf(this.slug) >= 0
        }).length;

        if (!window.wfaccordion.slugs.includes(this.slug)) {
            window.wfaccordion.slugs.push(this.slug);
            this.triggerId = this.slug;
            this.panelId = this.slug + '-panel';
        } else {
            window.wfaccordion.slugs.push(this.slug + '-' + this.slugOccurence);
            this.triggerId = this.slug + '-' + this.slugOccurence;
            this.panelId = this.slug + '-panel' + '-' + this.slugOccurence;
        }

        enhanceWithButton(this.root, this.settings);

        // get a fresh reference after enhancements
        this.trigger = this.root.querySelector(this.settings.accordionTrigger);

        this.events();

        // Prevent duplicated IDs on root and trigger element
        this.root.removeAttribute('id');

        // Get initial state
        this.isDisabled = this.root.hasAttribute('data-wf-accordion-disabled');
        this.isTargetOfUrlHash = this.triggerId === getUrlHash();
        this.isExpandedOnStartup = this.root.hasAttribute('data-wf-accordion-expanded');

        // Create ARIA relationships between headers and panels and set initial state
        this.trigger.setAttribute('id', this.triggerId);
        this.trigger.setAttribute('aria-controls', this.panelId);
        this.trigger.setAttribute('aria-disabled', this.isDisabled);
        this.trigger.setAttribute('aria-expanded', this.isExpandedOnStartup);

        if (this.panel) {
            this.panel.setAttribute('id', this.panelId);
            this.panel.setAttribute('aria-labelledby', this.triggerId);
            this.panel.setAttribute('aria-hidden', !this.isExpandedOnStartup);
        }

        if (this.isTargetOfUrlHash && !this.isDisabled) {
            this.trigger.focus();

            this.root.dispatchEvent(new CustomEvent('wf.accordion.expand', {
                bubbles: true,
                cancelable: true,
            }));
        }
    }

    expand() {
        this.trigger.setAttribute('aria-expanded', true);
        this.panel.setAttribute('aria-hidden', false);
    }

    collapse() {
        this.trigger.setAttribute('aria-expanded', false);
        this.panel.setAttribute('aria-hidden', true);
    }

    toggle() {
        const isExpanded = this.trigger.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
            this.collapse()
        } else {
            this.expand()
        }
    }

    updateHash() {
        // Update URL with hash when an accordion expands
        if (this.trigger.getAttribute('aria-expanded') === 'true' && this.triggerId !== getUrlHash()) {
            setUrlHash(this.triggerId);
        } else if (this.trigger.getAttribute('aria-expanded') === 'false' && this.triggerId === getUrlHash()) {
            removeUrlHash();
        }
    }

    events() {
        if (!this.isDisabled) {
            this.root.addEventListener('wf.accordion.expand', event => {
                this.expand();
            });

            // Update ARIA states on click/tap
            this.trigger.addEventListener('click', () => {
                this.toggle();

                if (!this.settings.disableHashUpdate) {
                    this.updateHash();
                }
            });
        }
    }
}

class wfaccordionGroup {
    constructor(elem, options) {
        this.group = elem;
        this.settings = {
            ...defaultOptions,
            ...options
        };
        this.accordions = Array.from(this.group.querySelectorAll(this.settings.accordionRoot))
            .filter(root => this.group === root.parentElement)
            .map((root) => {
                return new wfaccordion(root, options);
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
    const settings = {
        ...defaultOptions,
        ...options
    }
    const wfaccordionGroups = Array.from(document.querySelectorAll(settings.accordionGroup));

    window.addEventListener('wf.accordions.mounted', (event) => {
        if (initCallback) {
            initCallback(event);
        }
    });

    wfaccordionGroups.forEach((group, index) => {
        window.wfaccordion.groups.push(new wfaccordionGroup(group, settings));

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
