;(function($, window, document, undefined) {
    'use strict';


    /**
    * Returns the loaction hash minus the hash-symbol
    */
    function getUrlHash() {
        return window.location.hash.replace('#', '');
    }

    /**
     * Use history.replaceState so clicking through accordions
     * does not create dozens of new history entries.
     * Browser back should navigate to the previous page
     * regardless of how many accordions were activated.
     *
     * @param {string} hash
     */
    function setUrlHash( hash ) {
        if ( history.replaceState ) {
            history.replaceState(null, '', '#' + hash);
        } else {
            location.hash = hash;
        }
    }

    /**
     * Create a slug from any string.
     * https://gist.github.com/hagemann/382adfc57adbd5af078dc93feef01fe1
     *
     * @type {string}
     */
    function slugify(string) {
        var a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;';
        var b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------';
        var p = new RegExp(a.split('').join('|'), 'g');

        return string.toString().toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(p, function(c) { return b.charAt(a.indexOf(c)); }) // Replace special characters
            .replace(/&/g, '-') // Replace & with '-'
            .replace(/[^\w\-]+/g, '') // Remove all non-word characters
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, '') // Trim - from end of text
    }

    /**
     * Create a counter (used a for creation of unique IDs)
     *
     * @type {number}
     */
    window.wfaccordion = window.wfaccordion || {};
    window.wfaccordion.slugs = window.wfaccordion.slugs || [];

    // constructor
    var Accordion = function(elem, options) {
        this.$elem = $(elem);
        this.options = options;
    };

    // the plugin prototype
    Accordion.prototype = {
        defaults: {
            accordionGroup: '.js-accordion-group',
            accordionRoot: '.js-accordion',
            accordionHeader: '.js-accordion__header',
            accordionTrigger: '.js-accordion__trigger',
            accordionPanel: '.js-accordion__panel'
        },

        init: function() {
            // Introduce defaults that can be extended either
            // globally or using an object literal.
            this.settings = $.extend({}, this.defaults, this.options);

            var $accordionRoot = this.$elem.find(this.settings.accordionRoot);
            var $accordionHeaders = this.$elem.find(this.settings.accordionHeader);
            var self = this;

            $accordionRoot.each(function(index, root) {
                var $root = $(root);
                var $header = $root.children($accordionHeaders);
                var $triggerPlaceholder = $header.find(self.settings.accordionTrigger);
                var $panel = $root.children(self.settings.accordionPanel);
                var isDisabled = typeof $root.attr('data-wf-accordion-disabled') !== 'undefined';
                var isExpandedOnStartup = typeof $root.attr('data-wf-accordion-expanded') !== 'undefined';

                var $trigger = self.enhanceWithButton($triggerPlaceholder);

                // Enhance triggers and panels with ARIA attributes
                $trigger.attr('aria-expanded', false);
                $panel.attr('aria-hidden', true);

                // Handle initial accordion states
                $trigger.attr('aria-disabled', isDisabled);
                $trigger.attr('aria-expanded', isExpandedOnStartup);
                $panel.attr('aria-hidden', !isExpandedOnStartup);

                // Create unique IDs for use in ARIA relationships
                var headerId, panelId;
                var accordionSlug = $root.attr('id') || slugify($trigger.text());
                var slugOccurence = $.grep(window.wfaccordion.slugs, function (slug, index) {
                    return slug.indexOf(accordionSlug) >= 0
                }).length;

                if ($.inArray(accordionSlug, window.wfaccordion.slugs) === -1) {
                    window.wfaccordion.slugs.push(accordionSlug);
                    headerId = accordionSlug;
                    panelId = accordionSlug + '-panel';
                } else {
                    window.wfaccordion.slugs.push(accordionSlug + '-' + slugOccurence);
                    headerId = accordionSlug + '-' + slugOccurence;
                    panelId = accordionSlug + '-panel' + '-' + slugOccurence;
                }

                $root.removeAttr('id'); // Prevent duplicated IDs on root and header element

                // Create ARIA relationships between headers and panels
                $trigger.attr('aria-controls', panelId);
                $panel.attr('id', panelId);

                $trigger.attr('id', headerId);
                $panel.attr('aria-labelledby', headerId);

                // Update ARIA states on click/tap
                $trigger.on('click', function(event) {
                    var $target = $(event.target);
                    var state = $target.attr('aria-expanded') === 'false';

                    if (!isDisabled) {
                        $target.attr('aria-expanded', state);
                        $('#' + $target.attr('aria-controls')).attr('aria-hidden', !state);
                    }

                    $(this).trigger('wfAccordionClick', {
                        target: $target,
                        id: $target.attr('id'),
                        expanded: $target.attr('aria-expanded')
                    });
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

    // Provide expanding/navigate-to functionality via hash
    $(window).on('wfAccordionClick', function (event, data) {
        var locationWithoutHash = getUrlHash();

        if (data.expanded === 'true' && data.id !== locationWithoutHash) {
            setUrlHash(data.id);
        }
    });

    $(document).ready(function() {
        var locationWithoutHash = getUrlHash();
        if (!locationWithoutHash) return;

        var $trigger = $('[id=' + locationWithoutHash + ']');
        var isExpandedOnStartup = $trigger.closest('[data-wf-accordion-expanded]').length;

        if (!isExpandedOnStartup) {
            $trigger.trigger('click');
        }
        $trigger.focus();
    });

    $.fn.wfAccordion = function(options) {
        return this.each(function() {
            new Accordion(this, options).init();
        });
    };

})(jQuery, window , document);
