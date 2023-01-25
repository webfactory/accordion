import { enhanceWithButton } from "../src/helper";
import {
    createBasicAccordion,
    createAccordionWithButton,
    createAccordionWithFormattedPlaceholder,
    createAccordionWithXSSContent
} from "./mocks/accordion.html";

describe('Accordion is enhanced with button', () => {
    test('Basic accordion', () => {
        createBasicAccordion();

        const header = document.querySelector('.js-accordion__header');
        const accordion = document.querySelector('.js-accordion');

        enhanceWithButton(accordion);

        expect(header.innerHTML.trim()).toBe('<button class="js-accordion__trigger" type="button">Titel</button>');
    });

    test('Accordion with existing button', () => {
        createAccordionWithButton();

        const header = document.querySelector('.js-accordion__header');
        const accordion = document.querySelector('.js-accordion');

        enhanceWithButton(accordion);

        expect(header.innerHTML.trim()).toBe('<button class="js-accordion__trigger" type="button">Titel</button>');
    });

    test('Accordion with formatted placeholder (strong, em)', () => {
        createAccordionWithFormattedPlaceholder();

        const header = document.querySelector('.js-accordion__header');
        const accordion = document.querySelector('.js-accordion');

        enhanceWithButton(accordion);

        expect(header.innerHTML.trim()).toBe('<button class="js-accordion__trigger" type="button">Titel <strong>bold</strong></button>');
    });

    test('Accordion with XSS Content is sanitized', () => {
        createAccordionWithXSSContent();

        const header = document.querySelector('.js-accordion__header');
        const accordion = document.querySelector('.js-accordion');

        enhanceWithButton(accordion);

        expect(header.innerHTML.trim()).toBe('<button class="js-accordion__trigger" type="button">Titel <img src="x"></button>');
    });
});
