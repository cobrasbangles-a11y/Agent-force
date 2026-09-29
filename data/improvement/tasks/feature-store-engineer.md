# Task for: feature-store-engineer

We're a lending fintech with a fraud model scored at application time
(p99 budget of 40 ms for all feature lookups). The data science team trained
the new model on a "txn_count_30d" feature computed in a Spark batch job from
settled transactions, while the online service computes it from a Redis
counter of authorized transactions. Offline AUC is 0.91, but since launch
three weeks ago the approve/decline mix has shifted and the fraud team says
losses are up. They also want a new feature, "distinct_devices_90d," available
for training by October 24 with two years of backfill, and they asked us to
just join the current device table onto historical applications because it's
fast. Another team uses our "credit_utilization" feature and wants to change
its definition in place. Also, the feature is built partly from
bureau data that has a contractual 25-month retention limit. How do we
diagnose the live issue, build the new feature correctly, and handle the
change request?
