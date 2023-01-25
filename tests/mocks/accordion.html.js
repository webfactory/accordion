/**
 * Creates an accordion in JSDOM for testing.
 *
 * @param {{}} [options]
 * @param {string} options.id – e.g. "my-accordion"
 * @param {string} options.dataAttr – e.g. "data-wf-accordion-disabled"
 * @param {string} options.placeholder – e.g. `<button class="js-accordion__trigger">…</button>`
 * @param {string} options.placeholderContent – e.g. `I am <strong>`
 * @param {boolean} options.hasPanel – optional param to simulate an accordion without panel
 */
export function createAccordionGroup(options) {
    // set defaults
    options = {
        ...{
            id: undefined,
            dataAttr: undefined,
            placeholder: undefined,
            placeholderContent: undefined,
            hasPanel: true
        },
        ...options
    }
    let htmlId = options.id ? `id="${options.id}"` : '';
    let htmlDataAttr = options.dataAttr ?? '';
    let placeholderInnerHtml = options.placeholderContent ? options.placeholderContent : `Title`;
    let placeholderOuterHtml = options.placeholder ? options.placeholder : `<div class="js-accordion__trigger">${placeholderInnerHtml}</div>`;
    let panel = options.hasPanel ? `<div class="js-accordion__panel">Text</div>` : '';

    document.body.innerHTML = `
        <div class="js-accordion-group">
            <div ${htmlId} class="js-accordion js-accordion--cke" ${htmlDataAttr}>
                <div class="js-accordion__header">
                    ${placeholderOuterHtml}
                </div>
                ${panel}
            </div>
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
    createAccordionGroup,
    createAccordionWithXSSContent,
};
