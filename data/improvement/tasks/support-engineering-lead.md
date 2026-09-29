# Task for: support-engineering-lead

I lead a pod of 3 Tier 2 and 2 Tier 3 support engineers for a data
integration platform. It's Monday morning and the queue has: an enterprise
customer ($1.2M ARR) whose CSM marked a Sev 1 because nightly Salesforce
syncs have been 40 minutes late for a week; 9 tickets from mid-market and
free accounts since Thursday reporting "duplicate rows" in Snowflake
destinations, assigned to four different engineers; a Tier 3 ticket 19
days old waiting on the connectors engineering team with no named owner;
an escalation packet from a Tier 2 engineer to engineering that says only
"customer says it's broken, please look"; and a Tier 3 engineer who wants
to run a SQL delete directly against a customer's destination table to
remove the duplicates for them. The enterprise CSM also wants me to promise
the customer a fix date by Wednesday. One of my Tier 2 engineers has closed
half as many tickets as the others for three weeks. How should I triage
and assign all this, and what do I do about the delete, the date promise,
and the engineer?
