# Task for: technical-product-manager

I'm the TPM for the data sync platform at an inventory-management SaaS. Our
connectors pull from customers' ERPs and push to our Postgres-backed API on a
15-minute batch schedule. Two enterprise customers (about $900k ARR
combined) want sub-5-second sync, and our CEO wants to announce "real-time
inventory" at our user conference in nine weeks. Engineering's rough view:
the batch jobs write through a single shared table per tenant that is
locked during each run, 30 or so internal services and roughly 200
customer integrations read our v2 inventory API, and the p99 latency of
that API is already 780 ms against a 500 ms SLO. Two options are on the
table: build change-data-capture on our own Kafka cluster, or pay for a
managed streaming service at about $180k a year. The data team also wants
to rename and retype three columns in the inventory schema as part of this.
Tell me what I can responsibly put on the roadmap, what to tell the CEO
about the conference, how to frame build versus buy, and how to handle the
schema change without breaking consumers.
