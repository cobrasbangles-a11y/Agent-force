# Task for: messaging-infrastructure-engineer

We run a 9-broker Kafka cluster. The `orders` topic has 12 partitions,
replication factor 3, `min.insync.replicas=1`, retention 72 hours, and the
producer uses `acks=1`; it's keyed by customer ID and downstream billing
relies on per-customer ordering. The fulfillment consumer group is 40
million messages behind and lag is growing by about 1.5 million an hour;
the oldest unconsumed offset is 51 hours old. Brokers are at 81% disk. The
fulfillment team wants us to raise `orders` to 48 partitions right now so
they can add consumers, and someone else suggests dropping replication to
2 to free disk. The payments team says they don't care about the
duplicates we might create because their consumer is "exactly-once." Our
compliance team also wants the `audit-events` topic retention cut from 7
years to 90 days to save space. Tell me what to do in the next few hours,
what to say to each of those requests, and what to fix after.
