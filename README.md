# wfAccordion
A tiny script that _progressively enhances_ static HTML with accessible and keyboard-enabled accordion functionality.

⚠️ **Please note:** 
- Depending on your requirements and browser support matrix, the [native HTML <details> element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details) may be sufficient for your accordion use case
- v4.0.0 and above have dropped jQuery and no longer support Internet Explorer.
- v2.0.0 and above require a wrapping element around any group of consecutive accordions.

## Usage
Required HTML structure:
```
<div class="wf-accordion-group js-accordion-group">
    <div class="wf-accordion js-accordion">
        <div class="wf-accordion__header js-accordion__header">
            <div class="wf-accordion__trigger js-accordion-trigger">Title</div>
        </div>
        <div class="wf-accordion__panel js-accordion__panel">Text</div>
    </div>
</div>
```

You can use `dist/wf.accordion.min.js` which will auto-initiate all accordions on page load if you follow the HTML structure shown above. If you want more fine-grained control, you can 
use ES Module `import` directly from `src/accordion.js`. You will need Webpack or similar to produce a bundle for production.

### Examples:

HTML:
```
<script src="path/to/node_modules/webfactory-accordion/dist/wf.accordion.min.js" defer></script>
```

ES Module import as-is:
```
import 'webfactory-accordion/dist/wf.accordion.min';
```

ES Module import with custom settings:
```
import { wfaccordionsInit } from 'webfactory-accordion/src/accordion';

wfaccordionsInit({
    accordionGroup: '.my-fancy-accordion-group-js-hook',
});

```

## Settings
Option | Type | Default | Description
------ | ---- | ------- | -----------
accordionGroup | string | '.js-accordion-group' | Class hook for the accordion wrapper. This is the hook you initiate the script with (see example above).
accordionRoot | string | '.js-accordion' | Class hook for the accordion. This is the internal hook used to find invidual accordions inside groups.
accordionHeader | string | '.js-accordion__header' | Class hook for the accordion header container.
accordionTrigger | string | '.js-accordion__trigger' | Class hook for the accordion title (a child of the header container). This element is transformed to a `<button>` by the plugin for accessibility reasons.
accordionPanel | string | '.js-accordion__panel' | Class hook for the accordion panel. This element is typically hidden by the plugin until the accordion is opened by the user.
disableHashUpdate | boolean | false | Disables the automated hash update when triggering an accordion.

### Notes:
- The accordion trigger can be any element (e.g. `<h2>`); you only need to be aware that a `<button>` will be inserted into this element 
  by the plugin and that all attributes of the trigger element will be moved to the `<button>`. The visual design
  should therefore depend on a class and not on the element!
- The names of CSS- and JS-hook-classes are completely customizable, you only need to pass the latter (`.js-*`) to the
  plugin via options if they differ from the defaults
- You can set any accordion to be expanded on initialization by applying the data attribute `data-wf-accordion-expanded` to the accordion container.
- You can set any accordion to be disabled by applying the data attribute `data-wf-accordion-disabled` to the accordion container.

### Keyboard support:
- All interactive elements observe normal tab ⇥ order (accordion triggers are focussable, open panels allow focussing of links inside themselves)
- Once an accordion receives focus, you can cycle through all accordions on the page with the arrow keys ↑↓
- You can navigate to the first or last accordion on the page with Page Up ↖ or Page Down ↘ respectively.
- Accordion triggers support Space and Enter ↵ keys for toggling of accordions.

## Credits, Copyright and License

This bundle was started at webfactory GmbH, Bonn.

- <https://www.webfactory.de>
- <https://twitter.com/webfactory>

Copyright 2019-2023 webfactory GmbH, Bonn. Code released under [the MIT license](LICENSE).
