import { simulateClick } from './helpers/interactions';
import { isExpanded, isCollapsed } from './helpers/state';
import { createAccordionGroup, createNestedAccordionGroup } from "./mocks/accordion.html";
import { wfaccordionsInit } from '../src/accordion';

describe('Simple accordion e2e tests', () => {
    test('Basic accordion setup with ARIA attributes', () => {
        createAccordionGroup();

        wfaccordionsInit();

        const trigger = document.querySelector('.js-accordion__trigger');
        const panel = document.querySelector('.js-accordion__panel');

        expect(trigger.nodeName.toLowerCase()).toBe('button');
        expect(trigger.getAttribute('aria-controls')).toBe('title-panel');
        expect(trigger.getAttribute('aria-disabled')).toBe('false');
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        expect(trigger.getAttribute('id')).toBe('title');
        expect(trigger.getAttribute('type')).toBe('button');

        expect(panel.getAttribute('aria-labelledby')).toBe('title');
        expect(panel.getAttribute('aria-hidden')).toBe('true');
        expect(panel.getAttribute('id')).toBe('title-panel');
    });

    test('Accordion ID consists of only human-readable text content (nested HTML is ignored)', () => {
        createAccordionGroup({placeholderContent: `<h2>some <span class="blue">nested</span> HTML</h2>`});

        wfaccordionsInit();

        const trigger = document.querySelector('.js-accordion__trigger');

        simulateClick(trigger);

        expect(trigger.getAttribute('id')).toBe('some-nested-html');
    });

    test('Accordion with pre-configured ID', () => {
        createAccordionGroup({id: 'custom-id'});

        wfaccordionsInit();

        const trigger = document.querySelector('.js-accordion__trigger');
        const panel = document.querySelector('.js-accordion__panel');

        expect(trigger.getAttribute('aria-controls')).toBe('custom-id-panel');
        expect(trigger.getAttribute('id')).toBe('custom-id');

        expect(panel.getAttribute('aria-labelledby')).toBe('custom-id');
        expect(panel.getAttribute('id')).toBe('custom-id-panel');
    });

    test('Opening an accordion correctly updates ARIA attributes', () => {
        createAccordionGroup();

        wfaccordionsInit();

        const accordion = document.querySelector('.js-accordion');
        const trigger = accordion.querySelector('.js-accordion__trigger');

        simulateClick(trigger);

        expect(isExpanded(accordion)).toBeTruthy();
    });

    test('Closing an open accordion correctly updates ARIA attributes', () => {
        createAccordionGroup();

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
        createAccordionGroup({dataAttr: 'data-wf-accordion-expanded'});

        wfaccordionsInit();

        const accordion = document.querySelector('.js-accordion');

        expect(isExpanded(accordion)).toBeTruthy();
    });

    test('Accordion can be configured to be disabled on page load', () => {
        createAccordionGroup({dataAttr: 'data-wf-accordion-disabled'});

        wfaccordionsInit();

        const trigger = document.querySelector('.js-accordion__trigger');

        expect(trigger.getAttribute('aria-disabled') === 'true').toBeTruthy();
    });

    test('Accordion can be expanded on page load via deep link (hash)', () => {
        const customId = 'my-deeplinked-accordion';

        createAccordionGroup({id: customId});

        delete window.location;
        window.location = new URL(`https://www.example.com#${customId}`);

        wfaccordionsInit();

        const accordion = document.querySelector('.js-accordion');

        expect(isExpanded(accordion)).toBeTruthy();
    });

    test('Nested accordion expands parent accordion if nested accordion is remotely opened', () => {
        const customOuterId = 'outer-accordion';
        const customInnerId = 'nested-inner-accordion';

        createNestedAccordionGroup({
            outerId: customOuterId,
            innerId: customInnerId,
        });

        delete window.location;
        window.location = new URL(`https://www.example.com#${customInnerId}`);

        wfaccordionsInit();

        const outerAccordionTrigger = document.getElementById(customOuterId);
        const outerAccordion = outerAccordionTrigger.closest('.js-accordion');

        const innerAccordionTrigger = document.getElementById(customInnerId);
        const innerAccordion = innerAccordionTrigger.closest('.js-accordion');

        expect(isExpanded(outerAccordion) && isExpanded(innerAccordion)).toBeTruthy();
    });

    test('Accordion ends up expanded on page load when configured to be expanded via data-attr as well as targeted by deep link (hash)', () => {
        const customId = 'my-deeplinked-accordion';

        createAccordionGroup({id: customId, dataAttr: 'data-wf-accordion-expanded'});

        delete window.location;
        window.location = new URL(`https://www.example.com#${customId}`);

        wfaccordionsInit();

        const accordion = document.querySelector('.js-accordion');

        expect(isExpanded(accordion)).toBeTruthy();
    });

    test('Accordion can be disabled and have no panel', () => {
        createAccordionGroup({dataAttr: 'data-wf-accordion-disabled', hasPanel: false});

        wfaccordionsInit();

        const trigger = document.querySelector('.js-accordion__trigger');

        expect(trigger.getAttribute('aria-disabled') === 'true').toBeTruthy();
    });

    test('Accordion can use custom class hooks', () => {
        document.body.innerHTML = `
            <div class="some-quirky-group-class">
                <div class="a-friggin-gordon">
                    <div class="header-in-the-clouds">
                        <div class="my-fancy-js-hook">Title</div>
                    </div>
                    <div class="get-panelized">Text</div>
                </div>
            </div>
          `;

        wfaccordionsInit({
            accordionGroup: '.some-quirky-group-class',
            accordionRoot: '.a-friggin-gordon',
            accordionHeader: '.header-in-the-clouds',
            accordionTrigger: '.my-fancy-js-hook',
            accordionPanel: '.get-panelized'
        });

        const accordion = document.querySelector('.a-friggin-gordon');
        const trigger = accordion.querySelector('.my-fancy-js-hook');

        simulateClick(trigger);

        expect(isExpanded(accordion, {accordionTrigger: '.my-fancy-js-hook', accordionPanel: '.get-panelized'})).toBeTruthy();
    });
});
