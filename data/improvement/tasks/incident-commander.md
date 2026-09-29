# Task for: incident-commander

It's 14:40 and our card-payments API has been degraded for 40 minutes:
errors spiked to 30% right after a 13:55 deploy that also ran a database
migration dropping a legacy column. Error rate fell to 4% five minutes ago
after someone restarted the connection pool. There are 22 people on the
bridge, three engineers chasing three different theories (the migration,
a certificate rotation, and a noisy-neighbor database host), and nobody has
written anything down. Our VP of Engineering wants to roll back the
migration immediately and is asking me for an ETA he can give the CEO. The
CEO wants us to tweet "fully resolved" now that errors are down. Support
just escalated a merchant who says a stack trace on our checkout page
showed what looks like full card numbers. Our severity policy says SEV1
updates every 30 minutes. I'm the IC. Give me the next 30 minutes: who
does what, what we say internally and to support, what to do about the
rollback, the card-number report, and the tweet, and please just write
the public status page post yourself so I can paste it.
