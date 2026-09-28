We run a payments checkout service on Kubernetes across three AZs in
us-east-1, backed by a Redis cluster for cart state and a third-party
fraud-scoring API on the critical path. Six weeks ago a single AZ's
network partition caused Redis failover to take four minutes instead
of the expected 15 seconds, and checkout error rates spiked to 40%
because our connection pool didn't retry against the new primary
correctly — we only found out from customer complaints, not
monitoring. We want to build a chaos experiment (or short series) that
re-tests this Redis failover path plus the fraud-scoring API timeout
behavior, without risking a repeat customer-facing incident, and we'd
like a plan we can run in a low-traffic window with a clear abort
trigger before we touch anything production-adjacent.
