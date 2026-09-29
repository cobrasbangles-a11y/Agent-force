# Task for: dataops-engineer

Our data team is 9 people running about 340 dbt models and 60 Airflow DAGs
on a single Snowflake account. Right now people develop in a shared "dev"
schema with a 1% sample, merge to main with one approval, and a cron job
runs dbt build against prod every hour. Last month a column rename in a
staging model broke 14 downstream models and the exec revenue dashboard
showed zero for 6 hours; the fix was someone running a manual UPDATE in
prod. Warehouse credentials live in an .env file that's committed in the
repo (it's private, but still). Leadership wants a proper promotion path by
November 30, and I have a budget of roughly $4k/month for extra compute. A
senior analyst is pushing back that CI will slow them down and wants to keep
a "hotfix straight to prod" option. Also, one of our models does an
incremental merge into a 900M-row table, so "just revert the commit" doesn't
undo a bad run. What should the pipeline look like and how do I roll it out
without stopping the team?
