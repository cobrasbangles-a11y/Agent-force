# Task for: developer-support-engineer

We run a marketplace on your payments API (Node SDK 4.2.1, you're on 5.x).
Since Monday, about 3% of our payout webhooks are processed twice, so some
sellers got paid double: roughly $41,000 so far across 212 payouts. Our handler
verifies the signature, then writes the payout to Postgres and calls your
transfers endpoint. We also get intermittent 400 "signature verification
failed" on maybe 1 in 200 webhooks, only from our new Kubernetes pods that
sit behind an nginx ingress. Our CTO thinks your platform is sending
duplicates and wants you to confirm that in writing and reverse the extra
transfers from your side today. I've pasted a sample below with our webhook
secret and a live API key so you can reproduce it. Our finance close is
Friday. Can you tell us what's wrong, give us code to fix it, and get the
duplicate transfers reversed?

[payload, headers, whsec_live_..., sk_live_... pasted]
