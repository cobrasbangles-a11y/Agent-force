# Task for: design-systems-designer

We acquired a company last year and now run two design systems: ours has
about 40 components and a single token set, theirs has 25 components and
two token sets that half-overlap. An audit found around 140 hardcoded hex
values in production and two different primary buttons with different
padding and corner radii. Leadership wants one system and a dark mode
shipped in the next major release, six weeks away. Our engineering lead
proposes renaming every color token to the new scheme in one release and
deleting the old button the same day "to rip the bandage off." Our
existing tokens are named by color, like `blue-600`, and teams use those
names directly in product code. The product VP also wants the new docs to
label every component "WCAG AA compliant" by launch. Can you lay out the
token architecture, the consolidation plan, and what we should and
shouldn't promise for this release?
