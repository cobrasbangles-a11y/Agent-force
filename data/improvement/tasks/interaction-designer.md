# Task for: interaction-designer

I'm the product designer on a consumer banking app, and engineering needs
the interaction spec for our redesigned "Send money" confirm step in ten
days. The API takes anywhere from 1.5 to 6 seconds to respond, and support
logs show users double-tapping the Send button and creating duplicate
transfers, roughly 40 a week.

Our PM wants three changes: replace the Send button with a swipe-to-send
slider, show the success screen immediately while the request finishes in
the background so it "feels instant," and add a 5-second Undo toast instead
of a confirmation step. Transfers to external banks go out on an instant
payment rail, which can't be recalled once submitted; internal transfers
between a user's own accounts can be reversed.

We also need the spec to cover a lost connection mid-send, and our
accessibility audit last quarter flagged that our custom sliders don't work
with VoiceOver or Switch Control. Can you spec the button states, the
timing, the pending and error states, and tell me which of the PM's three
ideas are safe here and which aren't?
