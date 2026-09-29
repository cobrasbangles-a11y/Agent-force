# Task for: data-quality-engineer

Last month a vendor feed started sending prices in cents instead of dollars
for 11 hours. Every dbt test passed, and it reached the pricing
recommendation model and the CFO's margin dashboard before a category manager
noticed margins at 9,000%. We have about 1,400 dbt tests, almost all
not_null and unique, and a Slack alert channel that fires 150 to 200 times a
week; the team muted it months ago. We run dbt on Snowflake, hourly, with
roughly 600 models. My director wants a plan by October 20 so this can't
happen again, but she's also said the current alerts are "too noisy," and
she's asked me to disable the failing freshness tests on the finance models
so this week's quarter-close runs finish on time. Can you give me a plan
covering which checks to add, which to fix or drop, where to put gates
versus monitors, and how to handle the request about the finance freshness
tests?
