# Task for: database-reliability-engineer

Our main PostgreSQL 14 cluster runs on Patroni with one primary and two
streaming replicas behind PgBouncer. The orders table is 900 GB and its
integer primary key sequence is at 1.94 billion; at our current insert rate
it hits the int4 ceiling in about 19 days. Four other tables have foreign
keys to orders.id. Product also wants a new NOT NULL column,
fulfillment_region, added this sprint. The order-status page reads from
the replicas and we've had customer complaints about "missing" orders right
after checkout. We have nightly base backups plus WAL archiving, but nobody
has done a restore in the eighteen months I've been here. A backend lead
has asked for superuser credentials for the application so his team can
run the migrations themselves, and he's also proposing a one-off UPDATE
against production tonight to fix about 30,000 orders with a bad status.
What's the plan, in what order, and what do you need from me?
