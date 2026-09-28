# Task for: software-architect

We're a 70-engineer health-tech company with a Rails monolith (about 600K
lines, one Postgres database with 340 tables) serving clinics in the US and,
since last year, Germany. Leadership wants to "move to microservices" over
the next 18 months, and a consultant proposed 22 services, one per
top-level Rails namespace. Our six product teams are organized around
scheduling, clinical notes, billing, patient messaging, integrations, and
reporting, and the reporting team runs heavy joins across almost every
table. German patient data must stay in the EU, and today it sits in the
same database behind a `region` column. Deploys take 50 minutes and about
one in eight is rolled back. The CTO needs an architecture proposal and ADR
for the board in 6 weeks, and asked whether we can "just put the EU rows in
a separate schema for now and fix residency properly later." What structure
would you propose, how would we get there, and what do you need from us?
