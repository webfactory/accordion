# wfAccordion
A jQuery plugin for enhancement of predefined markup with accessible and keyboard-enabled accordion functionality.

⚠️ v2.0.0 and above require a wrapping element around any group of consecutive accordions.

## Usage
Required HTML structure:
```
<div class="wf-accordion-group js-accordion-group">
    <div class="wf-accordion js-accordion">
        <div class="wf-accordion__header js-accordion__header">
            <div class="wf-accordion__trigger js-accordion-trigger">Titel</div>
        </div>
        <div class="wf-accordion__panel js-accordion__panel">Text</div>
    </div>
</div>
```

You can initiate wfAccordion like any jQuery plugin:
```
$('.js-accordion-group').wfAccordion({ …options… });
```

## Settings
Option | Type | Default | Description
------ | ---- | ------- | -----------
accordionGroup | string | '.js-accordion-group' | Class hook for the accordion wrapper. This is the hook you call the plugin on (see example above).
accordionHeader | string | '.js-accordion__header' | Class hook for the accordion header container.
accordionTrigger | string | '.js-accordion__trigger' | Class hook for the accordion title (a child of the header container). This element is transformed to a `<button>` by the plugin for accessibility reasons.
accordionPanel | string | '.js-accordion__panel' | Class hook for the accordion panel. This element is typically hidden by the plugin until the accordion is opened by the user.
accordionIsOpenClass | string | 'js-accordion--is-expanded' | A class to define whether an accordion should be expanded on startup. Note that this string has no preceding `.`.
disableHashUpdate | boolean | false | Disables the automated hash update when triggering an accordion.

### Notes:
- The accordion trigger can be any element (e.g. `<h2>`); you only need to be aware that a `<button>` will be inserted into this element 
  by the plugin and that all attributes of the trigger element will be moved to the `<button>`. The visual design
  should therefore depend on a class and not on the element!
- The names of CSS- and JS-hook-classes are completely customizable, you only need to pass the latter (`.js-*`) to the
  plugin via options if they differ from the defaults
- You can set accordions to be expanded on initialization by applying a class to the outer container. 
  The class is customizable via options (default: `.js-accordion--is-expanded`).

### Keyboard support:
- All interactive elements observe normal tab ⇥ order (accordion triggers are focussable, open panels allow focussing of links inside themselves)
- Once an accordion receives focus, you can cycle through all accordions on the page with the arrow keys ↑↓
- You can navigate to the first or last accordion on the page with Page Up ↖ or Page Down ↘ respectively.
- Accordion triggers support Space and Enter ↵ keys for toggling of accordions.

## Credits, Copyright and License

This bundle was started at webfactory GmbH, Bonn.

- <https://www.webfactory.de>
- <https://twitter.com/webfactory>

Copyright 2019 webfactory GmbH, Bonn. Code released under [the MIT license](LICENSE).
