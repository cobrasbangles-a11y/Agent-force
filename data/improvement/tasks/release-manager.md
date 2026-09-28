# Task for: release-manager

Our last release before the holiday freeze (freeze starts November 14,
lifts January 5) is scheduled for November 11. Five teams are in it:
Payments is shipping a database migration that drops a legacy column and
rewrites 40 million rows (estimated 90 minutes); the API team is changing
a response field the Payments service and our iOS and Android apps both
read; the mobile team is submitting new app versions that depend on that
API change and app-store review usually takes 1 to 3 days; and two teams
have small UI changes. Yesterday the load test for the Payments change
came back with an 18% p99 latency regression, which fails our agreed gate
of 10%. The VP of Product says the Payments work is tied to a contract and
wants it shipped anyway, and asked me to "approve an exception" so it can
also go out on November 18 if the 11th slips. Build me the release plan
for the 11th: sequencing, what can and cannot be rolled back, the go/no-go
criteria, and how I respond to the VP on both requests.
