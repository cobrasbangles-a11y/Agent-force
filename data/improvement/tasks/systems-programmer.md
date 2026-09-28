# Task for: systems-programmer

We maintain a C++17 in-memory message broker used by about 60 internal
services. After switching our per-connection buffer allocation to a
custom lock-free slab allocator (a Treiber stack of free blocks using a
single 64-bit compare-and-swap), throughput on x86 went up 22%, but since we
started running some nodes on ARM64 (Graviton) we see roughly one heap
corruption crash per 3 billion messages, always with a stack trace inside
unrelated code. TSan wasn't run because the build was "too slow." The
allocator also exports a C API that two teams link against as a shared
library, and we want to change a struct in that header to add a size-class
field. Release branch cuts in 12 days. A senior engineer proposes wrapping
the free-list pop in a retry loop and adding `-fno-strict-aliasing` to make
the crashes go away. What do you think is going on, how would you prove it,
and how should we fix and ship this safely?
