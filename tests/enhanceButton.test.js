import { enhanceWithButton } from "../src/helper";
import {
    createAccordionGroup,
    createAccordionWithXSSContent,
} from "./mocks/accordion.html";



describe('Accordion is enhanced with button', () => {
    test('Basic accordion', () => {
        createAccordionGroup();

        const header = document.querySelector('.js-accordion__header');
        const accordion = document.querySelector('.js-accordion');

        enhanceWithButton(accordion);

        expect(header.innerHTML.trim()).toBe('<button class="js-accordion__trigger" type="button">Title</button>');
    });

    test('Accordion with existing button', () => {
        createAccordionGroup({placeholder: `<button class="js-accordion__trigger">Title</button>`});

        const header = document.querySelector('.js-accordion__header');
        const accordion = document.querySelector('.js-accordion');

        enhanceWithButton(accordion);

        expect(header.innerHTML.trim()).toBe('<button class="js-accordion__trigger" type="button">Title</button>');
    });

    test('Accordion with formatted placeholder (strong, em)', () => {
        createAccordionGroup({placeholderContent: `Title <strong>bold</strong>`});

        const header = document.querySelector('.js-accordion__header');
        const accordion = document.querySelector('.js-accordion');

        enhanceWithButton(accordion);

        expect(header.innerHTML.trim()).toBe('<button class="js-accordion__trigger" type="button">Title <strong>bold</strong></button>');
    });

    test('Accordion with heading nested in placeholder', () => {
        createAccordionGroup({placeholderContent: `<h2>Title</h2>`});

        const header = document.querySelector('.js-accordion__header');
        const accordion = document.querySelector('.js-accordion');

        enhanceWithButton(accordion);

        expect(header.innerHTML.trim()).toBe('<h2><button class="js-accordion__trigger" type="button">Title</button></h2>');
    });

    test('Accordion with nested heading that contains formatted child', () => {
        createAccordionGroup({placeholderContent: `<h2>Title <strong>bold</strong></h2>`});

        const header = document.querySelector('.js-accordion__header');
        const accordion = document.querySelector('.js-accordion');

        enhanceWithButton(accordion);

        expect(header.innerHTML.trim()).toBe('<h2><button class="js-accordion__trigger" type="button">Title <strong>bold</strong></button></h2>');
    });

    test('Accordion with nested heading and whitespace', () => {
        createAccordionGroup({placeholder: `<div class="js-accordion__trigger"> <h2>Title</h2>
                </div>`});

        const header = document.querySelector('.js-accordion__header');
        const accordion = document.querySelector('.js-accordion');

        enhanceWithButton(accordion);

        expect(header.innerHTML.trim()).toBe('<h2><button class="js-accordion__trigger" type="button">Title</button></h2>');
    });

    test('Accordion with heading as placeholder', () => {
        createAccordionGroup({placeholder: `<h2 class="js-accordion__trigger">Title</h2>`});

        const header = document.querySelector('.js-accordion__header');
        const accordion = document.querySelector('.js-accordion');

        enhanceWithButton(accordion);

        expect(header.innerHTML.trim()).toBe('<h2><button class="js-accordion__trigger" type="button">Title</button></h2>');
    });

    test('Accordion with XSS Content is sanitized', () => {
        createAccordionWithXSSContent();

        const header = document.querySelector('.js-accordion__header');
        const accordion = document.querySelector('.js-accordion');

        enhanceWithButton(accordion);

        expect(header.innerHTML.trim()).toBe('<button class="js-accordion__trigger" type="button">Titel <img src="x"></button>');
    });
});
