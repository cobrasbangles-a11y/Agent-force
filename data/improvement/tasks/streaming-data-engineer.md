# Task for: streaming-data-engineer

We run a Kafka + Flink pipeline that computes real-time wallet balances for
a payments app: about 15,000 events a second normally, bursting to 90,000
on paydays. The topic has 24 partitions keyed by merchant_id. Last payday
we saw consumer lag hit 40 minutes, and three partitions were doing 60% of
the traffic. After a Flink job restart we also found about 1,100 duplicate
balance credits, and the balances are written to Postgres with plain
INSERTs. The job has a 10-minute checkpoint interval. Mobile events can
arrive up to 6 hours late when phones reconnect, and our 5-minute tumbling
windows drop them. Product wants balances to be exactly right and visible
within 2 seconds, and the fraud team wants us to change the event schema
this week to add a device-fingerprint field and rename "amount" to
"amount_minor." Can you tell me how to fix the duplicates, the lag, and the
late events, and what order to do it in before next payday in 9 days? And
can we just correct the bad balances directly in Postgres?
