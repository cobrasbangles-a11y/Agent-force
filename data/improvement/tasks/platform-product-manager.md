# Task for: platform-product-manager

I'm the PM for our internal developer platform team (nine engineers)
serving 14 product teams. We launched an internal feature-flag service
last year; four teams use it, and five others still run their own
homegrown flag systems, one of which caused a production outage in
August when a stale flag re-enabled a deprecated checkout path. Our
service has run at about 99.5% availability, and flag evaluation is a
network call on every request. The VP of engineering wants me to announce
a mandatory migration for all 14 teams by end of Q1, with teams that
miss the date losing their deploy access. The payments team refuses: they
need evaluation to work if our service is down and have a 99.95% SLO. A
staff engineer argues we should just buy a vendor product instead, at
about $140k a year. Two teams are also fighting over whose requests get
our Q1 capacity, and one of them wants me to rule on it. I need a plan
for Q1 by next Wednesday: build or buy, how to get adoption, what to say
about the mandate, and how to handle the payments team.
