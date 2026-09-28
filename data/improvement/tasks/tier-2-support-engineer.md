# Task for: tier-2-support-engineer

Escalated from Tier 1: a mid-market customer (Business plan, ~400 users) says
CSV exports from the Reports page fail with "Error 502" about half the time
since last Thursday. Tier 1 already had them clear cache, try another browser,
and retry. Customer says the failures started "around 9am," they're in
Singapore, and our logs are in UTC. Two other tickets this week mention 502s
on exports, both from accounts with more than 50,000 rows. The customer's
admin says a successful export last week showed some rows with blank
amounts, and asks whether they can use our API bulk endpoint as a workaround
because their month-end close is Friday. Their account manager wants me to
tell them it'll be fixed by Wednesday. I have log access and a staging
account. Walk me through how you'd work this and what the escalation to
engineering should contain.
