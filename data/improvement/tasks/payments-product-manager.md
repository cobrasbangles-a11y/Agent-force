# Task for: payments-product-manager

We're a subscription SaaS (about 48k paying customers, $19 to $149 a
month) that launched in the EU and UK in June. Since then, first-payment
failures on European cards are around 22% versus 6% in the US, mostly
at the 3-D Secure step, and our monthly involuntary churn has gone from
1.8% to 4.1%. Our billing engineer wants to retry every failed renewal
up to ten times a day for two weeks, regardless of decline code, and to
flag all renewals as merchant-initiated so they skip authentication.
Our Visa dispute ratio is at 0.9% this month, up from 0.4%, mostly
"fraud, card-absent" disputes from a wave of free-trial signups. Growth
wants to loosen our fraud rules to fix EU conversion. The CTO also
floated storing full card numbers in our own database so we can build our
own account updater instead of paying the processor for it. I have a
board update in two weeks and need a plan: what's causing the EU failures,
what to do about retries and churn, how worried to be about disputes, and
a yes or no on the card storage idea.
