;(function($, window, document, undefined) {
    'use strict';

    /**
     * Create a counter (used a for creation of unique IDs)
     * @type {number}
     */
    window.wfaccordion = window.wfaccordion || {};
    window.wfaccordion.counter = window.wfaccordion.counter || 0;

    // constructor
    var Accordion = function(elem, options) {
        this.elem = elem;
        this.$elem = $(elem);
        this.options = options;
    };

    // the plugin prototype
    Accordion.prototype = {
        defaults: {
            context: 'body',
            accordionHeader: '.js-accordion__header',
            accordionTrigger: '.js-accordion__trigger',
            accordionPanel: '.js-accordion__panel',
            accordionIsOpenClass: 'js-accordion--is-expanded'
        },

        init: function() {
            // Introduce defaults that can be extended either
            // globally or using an object literal.
            this.settings = $.extend({}, this.defaults, this.options);

            var $context = $(this.settings.context);
            var $accordionHeaders = $context.find(this.settings.accordionHeader);
            var self = this;

            $accordionHeaders.each(function(index, header) {
                var $header = $(header);
                var $triggerPlaceholder = $header.find(self.settings.accordionTrigger);
                var $panel = $header.next(self.settings.accordionPanel);

                var $trigger = self.enhanceWithButton($triggerPlaceholder);

                // Enhance triggers and panels with ARIA attributes
                $trigger.attr('aria-expanded', false);
                $panel.attr('aria-hidden', true);

                // Create unique IDs for use in ARIA relationships
                var headerId = 'accordion-' + window.wfaccordion.counter + '__header-' + index;
                var panelId = 'accordion-' + window.wfaccordion.counter +  '__panel-' + index;

                // Create ARIA relationships between headers and panels
                $trigger.attr('aria-controls', panelId);
                $panel.attr('id', panelId);

                $trigger.attr('id', headerId);
                $panel.attr('aria-labelledby', headerId);

                // Open accordions that were set to "open on startup" via class
                if ($header.parent().hasClass(self.settings.accordionIsOpenClass)) {
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
                    var $header = $target.parents(self.settings.accordionHeader);

                    // 33 = Page Up, 34 = Page Down
                    var ctrlModifier = (event.ctrlKey && key.match(/33|34/));

                    // Support up / down arrows as well as Ctrl + Page Up / Page Down keys
                    // 38 = Up, 40 = Down
                    if (key.match(/38|40/) || ctrlModifier) {
                        var index = $accordionHeaders.index($header);
                        var direction = (key.match(/34|40/)) ? 1 : -1;
                        var length = $accordionHeaders.length;
                        var newIndex = (index + length + direction) % length;

                        $($accordionHeaders[newIndex]).find(self.settings.accordionTrigger).focus();

                        event.preventDefault();
                    } else if (key.match(/35|36/)) {
                        // Support End and Home keys
                        // 35 = End, 36 = Home
                        switch (key) {
                            // Focus the first accordion
                            case '36':
                                $($accordionHeaders[0]).find(self.settings.accordionTrigger).focus();
                                break;
                            // Focus the last accordion
                            case '35':
                                $($accordionHeaders[$accordionHeaders.length - 1]).find(self.settings.accordionTrigger).focus();
                                break;
                        }

                        event.preventDefault();
                    }
                });
            });

            // Increment the counter with every instantiation of the plugin
            window.wfaccordion.counter++;

            return this;
        },

        /**
         * Enhance a given placeholder element with a <button> for better keyboard support
         *
         * @param {jQuery} $placeholder
         * @returns {jQuery}
         */
        enhanceWithButton: function($placeholder) {
            // Support the case that the placeholder may already be a button
            if ($placeholder.get('0').nodeName && $placeholder.get('0').nodeName.toLowerCase() === 'button') {
                return $placeholder;
            }

            var $button = $('<button>' + $placeholder.text() + '</button>');

            $.each(this.getAttributes($placeholder), function(key, value) {
                $button.attr(key, value);
            });

            $placeholder.html($button);

            this.removeAllAttributes($placeholder);

            return $button;
        },

        /**
         * Return all HTML attributes (and their values) of a given jQuery object
         * @param {jQuery} $node
         * @returns {{}}
         */
        getAttributes: function($node) {
            var attrs = {};
            $.each( $node[0].attributes, function (index, attribute) {
                attrs[attribute.name] = attribute.value;
            } );

            return attrs;
        },

        /**
         * Strip all HTML attributes (and their values) from a given jQuery object
         * @param {jQuery} $node
         */
        removeAllAttributes: function($node) {
            // Support non-jQuery node objects, just in case…
            var elem = $node instanceof jQuery ? $node.get('0') : $node;

            while(elem.attributes.length > 0) {
                elem.removeAttribute(elem.attributes[0].name);
            }
        }
    };

    Accordion.defaults = Accordion.prototype.defaults;

    $.fn.wfAccordion = function(options) {
        return this.each(function() {
            new Accordion(this, options).init();
        });
    };

})(jQuery, window , document);
