export function createBasicAccordion() {
    document.body.innerHTML = `
        <div class="js-accordion js-accordion--cke">
            <div class="js-accordion__header">
                <div class="js-accordion__trigger">Titel</div>
            </div>
            <div class="js-accordion__panel">Text</div>
        </div>
      `;
}

/**
 * Creates an accordion in JSDOM for testing.
 *
 * @param {string} id – e.g. "my-accordion"
 * @param {string} dataAttr – e.g. "data-wf-accordion-disabled"
 */
export function createBasicAccordionGroup(id, dataAttr) {
    let htmlId = id ? `id="${id}"` : '';
    let htmlDataAttr = dataAttr ?? '';

    document.body.innerHTML = `
        <div class="js-accordion-group">
            <div ${htmlId} class="js-accordion js-accordion--cke" ${htmlDataAttr}>
                <div class="js-accordion__header">
                    <div class="js-accordion__trigger">Titel</div>
                </div>
                <div class="js-accordion__panel">Text</div>
            </div>
        </div>
      `;
}

export function createAccordionWithFormattedPlaceholder() {
    document.body.innerHTML = `
        <div class="js-accordion js-accordion--cke">
            <div class="js-accordion__header">
                <div class="js-accordion__trigger">Titel <strong>bold</strong></div>
            </div>
            <div class="js-accordion__panel">Text</div>
        </div>
      `;
}

export function createAccordionWithButton() {
    document.body.innerHTML = `
        <div class="js-accordion js-accordion--cke">
            <div class="js-accordion__header">
                <button class="js-accordion__trigger">Titel</button>
            </div>
            <div class="js-accordion__panel">Text</div>
        </div>
      `;
}

export function createAccordionWithXSSContent() {
    document.body.innerHTML = `
        <div class="js-accordion js-accordion--cke">
            <div class="js-accordion__header">
                <button class="js-accordion__trigger">Titel <img src=x onerror="alert(\'XSS Attack\')"></button>
            </div>
            <div class="js-accordion__panel">Text</div>
        </div>
      `;
}

export default {
    createBasicAccordion,
    createBasicAccordionGroup,
    createAccordionWithFormattedPlaceholder,
    createAccordionWithButton,
    createAccordionWithXSSContent,
};
