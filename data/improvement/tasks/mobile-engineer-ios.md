# Task for: mobile-engineer-ios

Our SwiftUI note-taking app (iOS 16 minimum, about 250k monthly users) has
two fires. First, since the latest iOS point release our crash reports show a
spike: many are terminations at launch on older iPhones with no Swift stack,
some mention memory, and a Core Data crash appears when sync runs while the
user edits. Second, App Store review rejected our last build, citing missing
privacy manifest declarations for an analytics SDK and asking where account
deletion lives, since we require sign-up. Product wants offline edits to sync
"every 15 minutes in the background, guaranteed", and proposes sending silent
pushes on a timer to achieve that. They also want to launch a crypto tipping
feature that they expect review might not approve, so the suggestion is to
ship it behind a remote flag that stays off until the build is approved. We
need a resubmission in 10 days because a marketing launch is booked. Tell me
how you'd triage the crashes, fix the rejection, design the sync, and what
you think about the flag plan.
