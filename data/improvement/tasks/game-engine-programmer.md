# Task for: game-engine-programmer

We have a custom C++ engine shipping a co-op action game on PC, PS5, Xbox
Series X|S, and a 30fps Switch-class target. Two problems before our content
lock in five weeks. First, in the arena mode frame time is fine at about
14ms on PS5 until a boss fight spawns roughly 3,000 projectiles and particle
emitters, then we see 40-70ms spikes every few seconds; the profiler shows
time in `new`/`delete` and in the physics step, which sometimes runs four or
five substeps in one frame. Second, open-world traversal hitches for 100ms+
when crossing streaming cell borders on Series S. The gameplay lead wants to
"fix the jitter" by switching physics to a variable timestep scaled by frame
delta, because our characters also visibly stutter on 144Hz monitors. Our
online co-op uses deterministic lockstep with rollback. Also, our producer
asked whether we can submit to platform certification with a known crash on
suspend/resume on one console and patch it day one, and asked you to paste
the relevant section of the console SDK docs into our public Discord FAQ.
What should we do, in what order?
