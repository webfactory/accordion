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

export function createBasicAccordionGroup() {
    document.body.innerHTML = `
        <div class="js-accordion-group">
            <div class="js-accordion js-accordion--cke">
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
