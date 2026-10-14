# Sports Arena Afrika Master Specification Addendum

## Mandatory: Admin-Controlled Website Appearance

The public website's appearance is platform configuration owned by the Chief Editor. Readers consume the published configuration and must not receive a light/dark switch or controls for site layout, branding, or navigation.

### Required admin controls

- Light or dark site theme, with an admin preview before applying.
- Brand colors and approved heading/body font choices.
- Homepage blocks must be addable, removable, re-orderable, and configurable by the Chief Editor, with News Focused, Magazine, and Compact presets. Admins can add editorial feature blocks with a title and intro when new coverage is needed.
- Main navigation visibility and ordering.
- Header behavior and visibility of search and social links.
- Article width/layout and optional sidebar.
- Header branding: logo, logo size, header height, navigation style, sticky behavior, search, social links, and ad position.
- Configurable navigation dropdown contents.
- Footer logo, about text, links, social/contact details, copyright, newsletter, and ad placement.
- Favicon and featured content/ad placement controls.
- Typography sizes, article heading size, navigation size, and line spacing, within readable limits.
- Desktop, tablet, and mobile preview modes.
- Save and apply settings to the reader-facing website.
- Preview changes before applying them publicly.

### Acceptance criteria

1. Reader pages load the same saved appearance configuration regardless of reader/browser preferences.
2. No public reader control changes the site theme.
3. Only an authorized Chief Editor can save appearance settings; readers can fetch the public configuration.
4. Homepage section and navigation selections/order affect the rendered public site.
5. A preview does not affect the public site until the administrator saves changes.
6. Saved colors and typography maintain readable contrast and are applied through shared design tokens.

## Implementation status

The current implementation covers theme, brand color tokens, heading/body font choices, homepage block add/remove/reorder, custom editorial intro blocks, layout presets, main navigation visibility/order, header sticky/search/social controls, article width/layout and sidebar, responsive preview frames, and persisted settings. The remaining required controls are not yet implemented: editable header/footer logo and favicon, header sizing/style/ad position, navigation dropdown contents, detailed footer content, featured-content and ad placement configuration, granular typography sizing/line spacing, and a full-page responsive preview. These remain mandatory requirements; do not describe them as available until they are connected to persisted settings and the public renderer.
