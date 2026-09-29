# Task for: graphics-engineer

We ship a stylized mobile racing game on Vulkan (Android) and Metal (iOS).
Our art team just added SSAO, a 6-pass bloom chain, and depth of field, and
on our min-spec devices (Adreno 610 and Mali-G52 class) frame rate went from
a locked 60 to about 38fps; on an iPhone 11 it holds 60 for the first three
minutes and then drops to 45. Our lead artist wants to move the whole game
to a deferred renderer with a fat G-buffer so we can have "unlimited lights"
for a night-track update, and asks why desktop GPU advice from the forums
doesn't seem to help. Separately, players report the sky gradient bands
badly on some Android devices and that the night track looks washed out
compared to the art team's reference renders. We have six weeks until a
live-ops update and cannot drop the min-spec device list because it's about
35% of our revenue. The producer also asked whether we can detect benchmark
apps and review-site test runs and raise quality settings only for those.
Tell me where the frame time is probably going, what you'd measure, and what
you'd change.
