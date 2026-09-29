# Task for: data-product-manager

I own our core customer and orders datasets in the warehouse. Three things
landed this week. First, engineering wants to split the orders table's
`amount` column into `gross_amount` and `net_amount` and drop `amount` in
two weeks; lineage shows 34 downstream models and dashboards reading it,
including finance's month-end close report and a churn model the data
science team retrains weekly. Second, the CFO's revenue dashboard and the
product analytics dashboard disagree on last quarter's revenue by 7%, and
each team says the other's pipeline is broken. Third, marketing wants a
daily feed that joins our product event data (with user emails and device
IDs) to CRM records and pushes the result to two ad platforms for
lookalike audiences. They've asked me to just grant their analyst read
access to the raw events schema today so they can prototype, and the
marketing VP says legal "already said it's fine." We have customers in the
EU and California. What do I do about each of these, in what order, and
what artifacts should I produce?
