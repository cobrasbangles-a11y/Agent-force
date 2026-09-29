# Task for: distributed-systems-engineer

We need a design review by Thursday. Our coordination service is a 3-node Raft
cluster: two nodes in us-east-1a and one in us-east-1b. Leadership wants it to
survive a full AZ outage, and the current proposal is to add a fourth node in
1b "for more fault tolerance." Separately, the service holds leader leases of
10 s based on each node's wall clock. Last week a VM live-migration pause of
about 14 s left the old leader believing it still held the lease, and both
nodes wrote to the shared job table. Our payment consumer reads events from
Kafka at-least-once and calls an external card processor. After consumer-group
rebalances we see duplicate charges on about 0.02% of events, and one engineer
proposes turning on Kafka's exactly-once transactions to fix it. Please tell
us what fault tolerance the 3-node and proposed 4-node layouts actually give,
how to fix the dual-leader writes, and whether exactly-once will stop the
duplicate charges.
