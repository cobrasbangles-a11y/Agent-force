# Task for: build-engineer

We run a Bazel monorepo with about 1,400 targets and 160 engineers. Clean CI
builds crept from 11 to 34 minutes over six months, and since we moved CI to a
mix of Linux x86 and macOS arm64 runners in August, the remote cache hit rate
fell from roughly 85% to 40%. On top of that, about one build in fifteen fails
in CI with a compile error against a stale generated protobuf header, and it
never reproduces locally. Our release branch is cut on October 15. The VP's
proposal is to move every runner to 64-core machines and to mark the flaky
targets as manual so they stop blocking merges until after the cut. One
engineer wants to speed things up by downloading a prebuilt `protoc` from a
GitHub release he found, instead of building it from source. Developer laptops
can currently write to the remote cache as well as CI. What's actually causing
the slowdown and the cache misses, which of these proposals should we take,
and what should we fix before the branch cut?
