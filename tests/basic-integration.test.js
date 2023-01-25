import { simulateClick } from './helpers/interactions';
import { isExpanded, isCollapsed } from './helpers/state';
import { createBasicAccordionGroup } from "./mocks/accordion.html";
import { wfaccordionsInit } from '../src/accordion';

describe('Simple accordion e2e tests', () => {
    test('Basic accordion setup with ARIA attributes', () => {
        createBasicAccordionGroup();

        wfaccordionsInit();

        const trigger = document.querySelector('.js-accordion__trigger');
        const panel = document.querySelector('.js-accordion__panel');

        expect(trigger.nodeName.toLowerCase()).toBe('button');
        expect(trigger.getAttribute('aria-controls')).toBe('titel-panel');
        expect(trigger.getAttribute('aria-disabled')).toBe('false');
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        expect(trigger.getAttribute('id')).toBe('titel');
        expect(trigger.getAttribute('type')).toBe('button');

        expect(panel.getAttribute('aria-labelledby')).toBe('titel');
        expect(panel.getAttribute('aria-hidden')).toBe('true');
        expect(panel.getAttribute('id')).toBe('titel-panel');
    });

    test('Accordion ID consists of only human-readable text content (nested HTML is ignored)', () => {
        createBasicAccordionGroup({placeholderContent: `<h2>some <span class="blue">nested</span> HTML</h2>`});

        wfaccordionsInit();

        const trigger = document.querySelector('.js-accordion__trigger');

        simulateClick(trigger);

        expect(trigger.getAttribute('id')).toBe('some-nested-html');
    });

    test('Accordion with pre-configured ID', () => {
        createBasicAccordionGroup({id: 'custom-id'});

        wfaccordionsInit();

        const trigger = document.querySelector('.js-accordion__trigger');
        const panel = document.querySelector('.js-accordion__panel');

        expect(trigger.getAttribute('aria-controls')).toBe('custom-id-panel');
        expect(trigger.getAttribute('id')).toBe('custom-id');

        expect(panel.getAttribute('aria-labelledby')).toBe('custom-id');
        expect(panel.getAttribute('id')).toBe('custom-id-panel');
    });

    test('Opening an accordion correctly updates ARIA attributes', () => {
        createBasicAccordionGroup();

        wfaccordionsInit();

        const accordion = document.querySelector('.js-accordion');
        const trigger = accordion.querySelector('.js-accordion__trigger');

        simulateClick(trigger);

        expect(isExpanded(accordion)).toBeTruthy();
    });

    test('Closing an open accordion correctly updates ARIA attributes', () => {
        createBasicAccordionGroup();

        wfaccordionsInit();

        const accordion = document.querySelector('.js-accordion');
        const trigger = accordion.querySelector('.js-accordion__trigger');

        // open
        simulateClick(trigger);

        // close
        simulateClick(trigger);

        expect(isCollapsed(accordion)).toBeTruthy();
    });

    test('Accordion can be configured to be expanded on page load', () => {
        createBasicAccordionGroup({dataAttr: 'data-wf-accordion-expanded'});

        wfaccordionsInit();

        const accordion = document.querySelector('.js-accordion');

        expect(isExpanded(accordion)).toBeTruthy();
    });

    test('Accordion can be configured to be disabled on page load', () => {
        createBasicAccordionGroup({dataAttr: 'data-wf-accordion-disabled'});

        wfaccordionsInit();

        const trigger = document.querySelector('.js-accordion__trigger');

        expect(trigger.getAttribute('aria-disabled') === 'true').toBeTruthy();
    });

    test('Accordion can be expanded on page load via deep link (hash)', () => {
        const customId = 'my-deeplinked-accordion';

        createBasicAccordionGroup({id: customId});

        delete window.location;
        window.location = new URL(`https://www.example.com#${customId}`);

        wfaccordionsInit();

        const accordion = document.querySelector('.js-accordion');

        expect(isExpanded(accordion)).toBeTruthy();
    });

    test('Accordion can be disabled and have no panel', () => {
        createBasicAccordionGroup({dataAttr: 'data-wf-accordion-disabled', hasPanel: false});

        wfaccordionsInit();

        const trigger = document.querySelector('.js-accordion__trigger');

        expect(trigger.getAttribute('aria-disabled') === 'true').toBeTruthy();
    });
});
