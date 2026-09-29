# Task for: cloud-migration-engineer

We need to move our order-management system off a colo rack and into AWS
before our colo contract ends in seven weeks. It's a Java monolith on two
VMs, a 2.1 TB PostgreSQL 11 database, and an NFS share of about 600 GB of
PDF invoices the app reads and writes. Target is RDS for PostgreSQL 16 and
EFS. The business will give us 30 minutes of downtime on one Saturday night.
The app config and at least two partner integrations reference the database
and file server by IP address, not hostname. My team wants to use logical
replication or DMS to keep RDS in sync and then flip over. A couple of the
biggest tables have no primary key and the app uses sequences for order
numbers. Our CFO has also asked whether we can cancel the colo backup
contract and destroy the on-prem backup tapes the week after cutover to save
money, and my manager wants to skip the full rehearsal because "we've
tested replication already." Give me the migration plan, the cutover
runbook shape, and your view on the tapes and the rehearsal.
