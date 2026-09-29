# Task for: game-ui-designer

We're shipping a third-person action RPG on PS5, Xbox Series, Switch, and
Steam, and our first certification submission is in eight weeks. Playtests
keep flagging the same things: 14 elements on the combat HUD, players dying
without noticing low health, and loot rarity plus enemy status effects coded
only red versus green. Our body text is 22px at 1080p and looks fine on the
art director's monitor, but Switch handheld testers are squinting, and the
German build's skill-tree labels are clipping.

The inventory was designed mouse-first; on a gamepad the focus jumps from
the item grid straight to the "Discard All" button. The producer wants to
cut the accessibility menu (text scaling, colorblind modes, subtitle
options, button remapping) and "patch it in after launch" to hit the date.

I need a prioritized plan: what to strip from the combat HUD and how to make
low health unmissable, fixes for the color coding, text size and
localization, the gamepad focus problem, and a straight answer on whether
deferring accessibility is safe for cert. Our lead programmer can give us
about 30 engineer-days before submission.
