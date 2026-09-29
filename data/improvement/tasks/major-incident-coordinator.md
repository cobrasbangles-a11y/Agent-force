# Task for: major-incident-coordinator

We're a payments SaaS and our checkout API has been returning intermittent
503s for 2 hours 10 minutes. About 18% of transactions are failing across
the EU region; US looks fine. Our last status-page post was 55 minutes ago
and said "next update in 30 minutes." Engineering's working theory in the
incident channel is that a cloud provider's load balancer is at fault, but
nobody has confirmed it, and our CEO wants the next update to say "caused by
a third-party provider outage" so we don't look bad. Support has 340 open
tickets and agents are telling customers "it's fixed" because one engineer
said a mitigation was deployed 20 minutes ago. Two enterprise customers with
99.95% SLAs are asking in their Slack channels whether they get service
credits, and one merchant asked whether they should retry failed charges.
I need, within the next 15 minutes: the status-page update to post now, the
macro for the support queue, what to say to the two enterprise accounts,
the guidance on retries, and the plan for the rest of the incident through
the resolution notice.
