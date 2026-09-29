# Task for: load-balancing-and-traffic-engineer

Our Black Friday sale starts in three weeks and we expect about 6x normal
peak (normal peak is 8,000 requests per second). Behind our L7 load
balancer we have 24 backends: 16 large instances and 8 half-size ones
added last month, all weighted equally with round robin. The health check
hits `/health` every 5 seconds with a 2-second timeout and pulls a backend
after one failure; `/health` also queries the database. During last
month's spike, backends started flapping in and out and the whole pool
went down within four minutes. Product wants a flat 100 requests per
second per client IP limit to stop bots, and the growth team wants
free-tier users dropped first if we get saturated. Our disaster plan is
DNS failover to a second region with a 300-second TTL, and that region is
sized at 40% of the primary. Tell me what to change before the sale, what
you think of the rate limit and shedding ideas, and how realistic our
failover is.
