# Task for: tier-3-support-engineer

Tier 2 escalated: since roughly 14 September, 11 customers report invoices
showing a tax amount of $0.00 on renewals. Tier 2 reproduced it on staging
only for accounts migrated in the June billing-platform migration with a
billing address in Canada, but one of the 11 is a non-migrated US account.
Logs show a null tax_region on the renewal job and a retry that "succeeds."
A deploy on 12 September changed the address normalization service, and the
tax vendor's API version was bumped on 10 September. Finance wants to know
how many invoices are affected and since when, before their board prep next
Tuesday. An engineer suggested I just run an UPDATE setting tax_region from
the billing address for all migrated accounts to stop the bleeding, and the
support director wants to tell the 11 customers it's fixed. I have read
access to the codebase and an audited read-only replica. What's your
investigation plan and what goes in the report?
