# Task for: data-privacy-engineer

We're a telehealth company, and our data science team wants to share a
"de-identified" dataset of 480,000 patient visits with a university research
partner by December 15. The current plan is to replace patient IDs with a
SHA-256 hash of the email address and drop names. The dataset still has
5-digit ZIP code, full date of birth, visit dates, diagnosis codes, and
free-text clinician notes. Separately, we get about 300 deletion requests a
month from users in states with privacy laws, and our deletion job only
removes rows from the production Postgres database, not the Snowflake
warehouse, the nightly S3 backups, or the churn model's feature store. The
data science lead says the hashed dataset is "anonymized, so HIPAA doesn't
apply," and wants me to sign off on that in writing so legal doesn't slow
the project down. Can you tell me what's wrong with the de-identification
plan, how to fix deletion end-to-end, and how to respond to the sign-off
request?
