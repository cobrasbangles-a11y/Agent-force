# Task for: runbook-automation-engineer

Our on-call gets paged about 60 times a month for "disk above 90%" on
Linux hosts, and each one takes 20 to 40 minutes. The current runbook is:
SSH in, find the biggest files under /var/log and the app log directory,
delete anything older than 7 days, and "if it is a database host, check
with the DBA first," then restart the app service if disk is still high.
Management wants this fully unattended within two weeks, triggered
straight from the alert, with no human involved. The fleet has about 400
hosts: app servers, 12 PostgreSQL primaries and replicas, and some hosts
running Java services that keep log files open. Last month someone deleted
a 30 GB log file on one of those Java hosts and the disk stayed at 97%. A
teammate already drafted a script that runs as root using a shared SSH
key embedded in the script. Design the automation and rollout, tell me
what in the current runbook should not be automated as written, and
whether the draft script is acceptable.
