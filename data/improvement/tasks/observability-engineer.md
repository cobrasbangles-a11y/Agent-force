# Task for: observability-engineer

Our observability bill went from $40K to $85K a month in two quarters and
the CFO wants it cut 40% by next quarter. What we know: one team added a
`customer_id` label to request-latency histograms (we have about 2
million customers); we ingest 6 TB of logs a day, all kept 30 days in hot
storage; and we trace 100% of requests. On-call gets about 200 pages a
week and most are auto-resolving CPU and disk alerts. The platform lead
proposes dropping all INFO and DEBUG logs and switching to 1% head-based
trace sampling. While looking at the logs we also found that one service
logs full Authorization headers and customer email addresses, and those
logs are shipped to our vendor. Legal meanwhile asked us to keep all logs
for two years "just in case." Give me the plan to hit the cost target
without blinding on-call, what's wrong with the platform lead's
proposal, and what to do about the leaking fields and the retention ask.
