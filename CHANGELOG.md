# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.0.0]
### Breaking
- Changes event name to expand an accordion from `wf.accordion.expandedByHash` to more generic `wf.accordion.expand`
- Excludes disabled accordions from event-driven status changes 

### Fixed
- Fixes a bug where an accordion set to expandOnStartup (via data-attr) that is also the target of the URL hash was toggled twice and ended up collapsed

### Added
- More unit tests

## [4.0.0]
### Breaking
- Drops jQuery dependency
- Moves to ES Modules architecture, change folder location of the script

### Added
- Unit tests with Jest
- Handles nested HTML in accordion trigger placeholders
- Handles headings as (or nested in) accordion trigger placeholders

## [3.0.0] - 2019-08-12
### Added
- Support initial expanding of a accordion via url-hash. 

### Changed
- Expanding accordions on page load is now triggered by the data attribute: 'data-wf-accordion-expanded'
- Data-attributes must be added to the accordions root element. 'js-accordion' by default.
- Ids for header/panel relationships will now be created with the root-elements id attribute value. If none is provided the script will create these with the accordion headers text.

## [2.0.0] - 2019-07-18
### Added
- Support for disabled accordions

### Changed
- Revised base markup pattern: a wrapping element around any group of accordions is now required.
- Changed plugin hook element: the plugin must now be invoked on wrapping group elements.

## [1.0.0] - 2017-12-08 to [1.2.0] - 2019-07-17
1.0.0 to 1.2.0 were the first versions of wfAccordion.  
