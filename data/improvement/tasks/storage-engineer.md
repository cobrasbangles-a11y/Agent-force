# Task for: storage-engineer

Our primary block array hosts a 14 TB PostgreSQL database for billing plus
about 200 VM datastores. The pool is thin provisioned: 180 TB allocated
against 100 TB physical, currently 88% physically used, growing about
2 TB a month and faster in Q4. At month-end the database volume's read
latency climbs from 2 ms to 25 ms while array capacity looks fine. The
array is RAID 5 across 16 TB drives. Replication to our DR site is
array-based and asynchronous. We need a plan this week because procurement
takes 10 weeks. My manager suggests three quick wins: delete all snapshots
older than 30 days to reclaim space, move the billing DB to the cheaper
nearline tier to free flash, and evict the analytics team's 20 TB scratch
volumes since "they can regenerate them." He also wants the audit report to
say billing data is protected because we keep daily snapshots. Tell me
what's actually going on, what to do in the next 10 weeks, and which of
those suggestions are safe.
