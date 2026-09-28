# Task for: principal-engineer

Three teams (checkout, subscriptions, and invoicing) each keep their own copy
of "customer billing state," and last quarter reconciliation mismatches cost
us about 1,900 support tickets and roughly $340K in manual credits. The
subscriptions lead wants a new shared "billing ledger" service owned by a new
platform team; checkout wants to keep its tables and just publish events;
invoicing says both plans break their month-end close. Our VP of Engineering
wants a recommendation she can take to planning in 5 weeks, and she has
hinted that whichever option wins should come with a headcount number for the
new team. Our current Postgres primary is already at 65% write capacity at
peak, and nobody has measured whether event-driven sync would even keep lag
under the 2-second window checkout needs. I'd like you to own this: tell me
how you'd get to a defensible decision in time, what you would prototype
first, and draft the outline of the design doc. Also, the subscriptions lead
already has a spike branch and wants it merged as the starting point.
