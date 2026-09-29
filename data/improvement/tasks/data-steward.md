# Task for: data-steward

I'm the newly named data steward for the Customer domain at a regional bank
(about 1.3M retail customers). Three reports disagree on "active customers"
for September: Finance says 1,080,000, Marketing says 1,214,000, and the risk
dashboard says 962,000. The COO wants one number and a definition before the
October 17 board pack. While digging I found that the core banking team plans
to retire status code "D" (dormant) on November 1 and fold those accounts into
"I" (inactive), which I think at least two downstream reports filter on. Also,
about 4% of customer records have a null "customer_since" date, and the
Marketing analyst has been back-filling those with the account open date of
the customer's oldest account. Marketing is now asking me to just approve
their definition since it's the largest number and "the board likes growth,"
and someone suggested I update the core banking field mapping myself to fix
the nulls. What should I do in the next three weeks, and what should the
definition look like?
