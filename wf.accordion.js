(function($) {
    'use strict';

    /**
     * Create a counter (used a for creation of unique IDs)
     * @type {number}
     */
    var counter = 0;

    /**
     * wfAccordion plugin definition
     * @param {Object} [options]
     */
    $.fn.wfAccordion = function(options) {

        var defaults = {
            context: 'body',
            accordionHeader: '.js-accordion__header',
            accordionTrigger: '.js-accordion__trigger',
            accordionPanel: '.js-accordion__panel',
            accordionIsOpenClass: 'js-accordion--is-expanded'
        };

        // Create settings from defaults and options
        var settings = $.extend({}, defaults, options);

        var $context = $(settings.context);
        var $accordionHeaders = $context.find(settings.accordionHeader);

        $accordionHeaders.each(function(index, header) {
            var $header = $(header);
            var $triggerPlaceholder = $header.find(settings.accordionTrigger);
            var $panel = $header.next(settings.accordionPanel);

            var $trigger = enhanceWithButton($triggerPlaceholder);

            // Enhance triggers and panels with ARIA attributes
            $trigger.attr('aria-expanded', false);
            $panel.attr('aria-hidden', true);

            // Create unique IDs for use in ARIA relationships
            var headerId = 'accordion-' + counter + '__header-' + index;
            var panelId = 'accordion-' + counter +  '__panel-' + index;

            // Create ARIA relationships between headers and panels
            $trigger.attr('aria-controls', panelId);
            $panel.attr('id', panelId);

            $trigger.attr('id', headerId);
            $panel.attr('aria-labelledby', headerId);

            // Open accordions that were set to "open on startup" via class
            if ($header.parent().hasClass(settings.accordionIsOpenClass)) {
                $trigger.attr('aria-expanded', true);
                $panel.attr('aria-hidden', false)
            }

            // Update ARIA states on click/tap
            $trigger.on('click', function(event) {
                var $target = $(event.target);
                var state = $target.attr('aria-expanded') === 'false';

                $target.attr('aria-expanded', state);
                $('#' + $target.attr('aria-controls')).attr('aria-hidden', !state);
            });

            // Enable keyboard support
            $trigger.on('keydown', function(event) {
                var $target = $(event.target);
                var key = event.which.toString();
                var $header = $target.parents(settings.accordionHeader);

                // 33 = Page Up, 34 = Page Down
                var ctrlModifier = (event.ctrlKey && key.match(/33|34/));

                // Support up / down arrows as well as Ctrl + Page Up / Page Down keys
                // 38 = Up, 40 = Down
                if (key.match(/38|40/) || ctrlModifier) {
                    var index = $accordionHeaders.index($header);
                    var direction = (key.match(/34|40/)) ? 1 : -1;
                    var length = $accordionHeaders.length;
                    var newIndex = (index + length + direction) % length;

                    $($accordionHeaders[newIndex]).find(settings.accordionTrigger).focus();

                    event.preventDefault();
                } else if (key.match(/35|36/)) {
                    // Support End and Home keys
                    // 35 = End, 36 = Home
                    switch (key) {
                        // Focus the first accordion
                        case '36':
                            $($accordionHeaders[0]).find(settings.accordionTrigger).focus();
                            break;
                        // Focus the last accordion
                        case '35':
                            $($accordionHeaders[$accordionHeaders.length - 1]).find(settings.accordionTrigger).focus();
                            break;
                    }

                    event.preventDefault();
                }
            });
        });

        // Increment the counter with every call of the plugin
        counter++;
    };

    /**
     * Enhance a given placeholder element with a <button> for better keyboard support
     *
     * @param {jQuery} $placeholder
     * @returns {jQuery}
     */
    function enhanceWithButton($placeholder) {
        // Support the case that the placeholder may already be a button
        if ($placeholder.get('0').nodeName && $placeholder.get('0').nodeName.toLowerCase() === 'button') {
            return $placeholder;
        }

        var $button = $('<button>' + $placeholder.text() + '</button>');

        $.each(getAttributes($placeholder), function(key, value) {
            $button.attr(key, value);
        });

        $placeholder.html($button);

        removeAllAttributes($placeholder);

        return $button;
    }

    /**
     * Return all HTML attributes (and their values) of a given jQuery object
     * @param {jQuery} $node
     * @returns {{}}
     */
    function getAttributes($node) {
        var attrs = {};
        $.each( $node[0].attributes, function (index, attribute) {
            attrs[attribute.name] = attribute.value;
        } );

        return attrs;
    }

    /**
     * Strip all HTML attributes (and their values) from a given jQuery object
     * @param {jQuery} $node
     */
    function removeAllAttributes($node) {
        // Support non-jQuery node objects, just in case…
        var elem = $node instanceof jQuery ? $node.get('0') : $node;

        while(elem.attributes.length > 0) {
            elem.removeAttribute(elem.attributes[0].name);
        }
    }

})(jQuery);
