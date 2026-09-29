# Task for: solutions-onboarding-engineer

We're migrating a 3,000-employee healthcare staffing firm from their legacy
CRM into our platform. Cutover is scheduled for Saturday 06:00, with users
back in on Monday 07:00. Source: 1.2M contact records, 340K accounts, and
8 years of activity notes (about 9M rows) exported as CSVs. Profiling so
far shows 11% of contacts share an email with another contact, 4,200
accounts have no owner, and the notes file mixes Windows-1252 and UTF-8.
Our import API allows 100 records per call and 600 calls per minute. The
customer's IT team wants to send us a full production export that includes
clinicians' license numbers and some Social Security numbers "just to be
safe," and their project lead asked us to merge duplicate contacts
automatically "however you think is best." SSO via their Okta tenant is
also going live the same weekend, and we have only a sandbox test so far.
Can you give me a migration plan with timing math, how to handle the
duplicates and the sensitive fields, the SSO risk, and the go/no-go and
rollback criteria?
