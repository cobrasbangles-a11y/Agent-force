# Task for: search-engineer

Our marketplace search runs on OpenSearch: one product index, 5 primary
shards, 1 replica, on 6 data nodes with 64 GB RAM each and a 31 GB heap. The
index has grown from 40M to 210M documents in 18 months (shards are now about
170 GB each) and is growing 8% a month. p99 latency went from 180 ms to
1.4 s at our 3,000 queries/sec evening peak, and we saw two circuit-breaker
trips last week during a price-sync burst. Merchants also complain that
price and stock changes take up to 10 minutes to show. We need to add a
`brand_normalized` keyword field and change `title` to a new analyzer. The
product team would also like us to "boost in-stock items and fix synonyms
while we're in there." Black Friday is 9 weeks away and we have one
engineer. My director suggested we just delete the index and rebuild it
overnight. What should we do, in what order, and what numbers do you need
from me?
