# Task for: performance-engineer

Our checkout API (Java 17, Spring Boot, Postgres, Redis) moved from VMs to
Kubernetes last month. On VMs, p99 was about 180ms at our peak of 2,500
requests per second; on Kubernetes, the average is fine at around 60ms but
p99 is 1.1-1.4s and spikes at the top of every minute. Pods have a 2-CPU
limit and our JVM heap was left at the old VM settings. Our load test with
a fixed pool of 200 virtual users that each wait for a response before
sending the next says p99 is 210ms, so the team thinks production
monitoring is wrong. Each checkout fans out to five internal services in
parallel. Our SLO is p99 under 300ms at 3,000 rps, and Black Friday is in
three weeks. One engineer proposes running the load test directly against
production, including our live payment provider, at 3x peak, and another
wants to turn off Postgres synchronous commit to "get the latency back".
Where would you look first, how would you prove it, and what would you
change?
