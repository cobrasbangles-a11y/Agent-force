# Task for: subscription-and-billing-product-manager

I own billing at a project-management SaaS with about 26,000 paying
subscriptions (70% monthly, 30% annual), customers in the US, UK and EU,
and Stripe as our processor. Leadership has approved a price change from
$12 to $15 per seat taking effect March 1, eleven weeks from now, and wants
it applied to every existing customer at their next renewal. Pricing is
decided; I own making it work. Three problems. First, our dunning sequence
recovers only 22% of failed renewals: every failure gets the same three
retries over five days and a generic "payment failed" email, and EU
cards often fail at renewal with authentication-required errors. Second,
support is flooded because mid-cycle downgrades refund the difference to
the card for some customers and issue account credit for others,
depending on which code path handled it, and finance says some already-sent
invoices were edited after issue to fix mistakes. Third, the growth team
wants to auto-renew monthly customers who switch to annual onto an annual
plan without a separate reminder. Give me the spec for the price migration,
a dunning redesign, and fixes for the downgrade and invoice problems.
