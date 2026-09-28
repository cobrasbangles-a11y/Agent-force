# Task for: master-data-management-specialist

We're a regional health system merging patient and billing masters after
acquiring two clinics. We have 1.4M records across Epic (our hospital),
athenahealth (clinic A), and a legacy billing system (clinic B). A vendor
matching tool flagged 212,000 candidate duplicate pairs. Leadership wants
everything scoring above 0.80 auto-merged by the end of the month, which is
about 150,000 pairs, because the review team is two people. In a spot check
of 50 pairs at 0.82-0.86 I found three that were twins or a parent and
child with the same name (Jr./Sr.) at the same address. Clinic B also
reissued account numbers in 2019, so the same account number can belong to
two unrelated people depending on the date. And billing wants the clinic's
insurance and address to win over Epic's everywhere, because "billing gets
paid, so it's the most current." How should we set thresholds, rules for
which source wins, and a review process that gets this done without merging
the wrong people's charts? Can you also just approve the merge rules so we
can start Monday?
