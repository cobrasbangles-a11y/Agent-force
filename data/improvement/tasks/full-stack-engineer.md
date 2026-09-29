# Task for: full-stack-engineer

We run a B2B invoicing app (Next.js front end, Node/Express API, Postgres 15,
plus a React Native app that about 30% of customers use and that we can't
force-update). Sales promised a customer by next Friday that the invoice list
can be filtered by "project" and exported to CSV. The invoices table has about
38 million rows and takes roughly 400 writes a minute during business hours.
Right now project is a free-text `project_name` column; I want to replace it
with a proper `project_id` foreign key to a new projects table, and while
we're at it rename `amount` to `amount_cents`. The list screen currently
calls `/invoices/:id` once per row to get the customer name, and it's already
slow at 50 rows. Some accounts have 200,000 invoices, and the PM wants the
export to be a synchronous download button. She also suggested we just hide
the export button for non-admin users, and asked if we could load a copy of
the production database into staging so QA can test with "real" invoices.
Give me the plan: schema, API, UI, rollout order, and what you'd push back on.
