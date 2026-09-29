# Task for: content-delivery-network-engineer

We run a mid-size online retailer behind a single CDN, and Black Friday is
ten days out. Our cache hit ratio is 61% and the origin is four app servers
that fall over at around 3,000 requests per second; last year's peak hit
2,400 at origin and we expect traffic to double. Looking at logs, product
page URLs arrive with utm_source, utm_campaign, gclid and fbclid parameters
that are all in the cache key. Our pricing system pushes updates every 15
minutes and right now each push triggers a purge-all. A developer has
proposed ignoring cookies in the cache key for all HTML so logged-in pages
get cached too, which would push us past 90% hit ratio. The mini-cart and
"Hi, Name" header are rendered server-side into that HTML. Marketing has
also asked us to block visitors from one country at the edge because
prices there are lower and they don't want those customers seeing them.
What changes should we make before Black Friday, in what order, and how do
we know they're working?
