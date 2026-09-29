# Task for: payments-engineer

We're a subscription SaaS (about 18,000 subscribers, $2.1M MRR) on Stripe,
expanding from the US into the EU and India next quarter. Three problems.
Our dunning logic retries every failed renewal once a day for 15 days
regardless of decline reason, and our processor has emailed us about high
decline rates. Early EU beta users' renewals fail with authentication
required even though they passed 3D Secure at signup. And finance says the
ledger doesn't tie to last month's payouts by $3,412, and they want to know
why before the auditors arrive in three weeks. On top of that our CTO wants
to switch processors next year and proposes that we start storing encrypted
card numbers ourselves now so we "own the data" and aren't locked in. We
also have a timeout bug: when the charge call times out, our code marks the
invoice failed and lets the customer click "pay again". Give me a plan for
retries, the EU renewals, the reconciliation gap, the processor migration,
and anything you'd add for India.
