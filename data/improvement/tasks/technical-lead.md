# Task for: technical-lead

I lead a six-engineer team that owns the notifications service (email, SMS,
push) at a B2B SaaS company. Three things are colliding. First, a mid-level
engineer has been stuck for two weeks building "exactly-once" SMS delivery
on top of our queue and keeps adding dedup tables. Second, our Kotlin
codebase has two competing patterns for retries (a homegrown helper in 40
places and Resilience4j in 15), and new PRs pick at random, which makes
reviews feel arbitrary. Third, the payments team wants us to change the
payload of our shared `notification.sent` event, which billing and
analytics consume, so they can attach invoice IDs, and they want it in by
the end of next sprint. We are committed to shipping per-tenant quiet hours
in 5 weeks and we have about 20% of capacity for non-roadmap work. My
director asked me to just approve the payload change today to keep payments
happy. How would you handle each, and what would you write down?
