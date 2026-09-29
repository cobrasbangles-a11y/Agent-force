I'm working on our Chromium-based browser fork, and users on Windows 11
laptops with Intel UHD 630 graphics are reporting visible stutter in
`<video>` playback roughly every 2 seconds, but only when hardware-accelerated
AV1 decode is on — it doesn't reproduce with software decode or on AMD/Nvidia
GPUs. Our compositor traces look normal (steady paint and composite times),
but the GPU process shows a CPU usage spike right before each stutter. I need
help figuring out whether this is a decode pipeline problem, a
frame-scheduling problem in the compositor, or an Intel driver interaction,
and whether this is something we should even be writing a regression test for
versus just reporting it upstream to the driver vendor. We ship this in an
Electron app to about 200,000 users and have a release freeze in 5 days.
