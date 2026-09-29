# Task for: compiler-engineer

We maintain an LLVM-based compiler for our in-house numerical DSL. Our
language spec defines 32-bit integers as two's-complement wrapping, and
floating point as strict IEEE 754 unless the user passes `--fast-math`. In
release 1.8.2 we enabled a new loop-invariant code motion pass at `-O2` and
turned on reassociation of floating-point adds "because every other compiler
does it at O2." Now a customer's signal-processing kernel gives different
results at `-O2` than at `-O0`. The results differ on x86 and on ARM, and on
x86 the loop also runs 40% fewer iterations. One of our engineers says the
kernel's counter overflows, so it's UB and not our bug. The customer wants a
fix in a 1.8.3 patch release on Friday. Our lead also wants to turn off the IR
verifier in release builds to win back the 8% compile-time hit from the new
pass. How do we find the actual cause, what should 1.8.3 contain, and is
disabling the verifier reasonable?
