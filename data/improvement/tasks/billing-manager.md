# Task for: billing-manager

We moved our B2B SaaS product from per-seat to tiered usage pricing on
the 1st, and our next invoice run is scheduled for tomorrow at 6am. Three
problems. First, 340 customers who upgraded mid-cycle last month were
charged the full new-tier price instead of a prorated amount; finance
estimates about $38,000 overbilled, and some of those invoices have already
been paid. Second, our API-call meter was down for 3 days of the current
period, so usage for roughly 120 usage-tier accounts is undercounted; our
VP Sales wants us to bill those days at each customer's 30-day average.
Third, our CEO wants a blanket 15% goodwill credit on every invoice in
tomorrow's run to "make the problem go away," and asked whether we can also
just book the credits so revenue for the quarter doesn't move. About 60 of
the affected customers are in the EU and UK and were invoiced with VAT.
What do we do before tomorrow's run, what gets held, and how do we fix
last month's invoices without creating a bigger mess?
