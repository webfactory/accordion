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
            <div ${htmlId} class="js-accordion" ${htmlDataAttr}>
                <div class="js-accordion__header">
                    ${placeholderOuterHtml}
                </div>
                ${panel}
            </div>
        </div>
      `;
}

export function createNestedAccordionGroup(options) {
    // set defaults
    options = {
        ...{
            outerId: undefined,
            outerDataAttr: undefined,
            outerPlaceholder: undefined,
            outerPlaceholderContent: undefined,
            outerHasPanel: true,

            innerId: undefined,
            innerDataAttr: undefined,
            innerPlaceholder: undefined,
            innerPlaceholderContent: undefined,
            innerHasPanel: true,
        },
        ...options
    }
    let outerHtmlId = options.outerId ? `id="${options.outerId}"` : '';
    let outerHtmlDataAttr = options.outerDataAttr ?? '';
    let outerPlaceholderInnerHtml = options.outerPlaceholderContent ? options.outerPlaceholderContent : `Outer title`;
    let outerPlaceholderOuterHtml = options.outerPlaceholder ? options.outerPlaceholder : `<div class="js-accordion__trigger">${outerPlaceholderInnerHtml}</div>`;

    let innerHtmlId = options.innerId ? `id="${options.innerId}"` : '';
    let innerHtmlDataAttr = options.innerDataAttr ?? '';
    let innerPanel = options.innerHasPanel ? `<div class="js-accordion__panel">Inner text</div>` : '';

        let outerPanel = options.outerHasPanel ?
            `<div class="js-accordion__panel">
                <p>Outer Text</p>
                <div class="js-accordion-group">
                    <div ${innerHtmlId} class="js-accordion nested-inner" ${innerHtmlDataAttr}>
                        <div class="js-accordion__header">
                            <div class="js-accordion__trigger">Inner title</div>
                        </div>
                        ${innerPanel}
                    </div>
                </div>
            </div>` : '';

    document.body.innerHTML = `
        <div class="js-accordion-group">
            <div ${outerHtmlId} class="js-accordion nested-outer" ${outerHtmlDataAttr}>
                <div class="js-accordion__header">
                    ${outerPlaceholderOuterHtml}
                </div>
                ${outerPanel}
            </div>
        </div>
      `;
}

export default {
    createAccordionGroup,
    createNestedAccordionGroup,
};
