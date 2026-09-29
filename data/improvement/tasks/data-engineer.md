# Task for: data-engineer

Our nightly orders pipeline pulls from a Postgres OLTP database (about 3M new
rows a day, 1.1B total) into BigQuery using `updated_at > last_run`. Finance
found that September revenue in the warehouse is $184k higher than the
billing system shows. We traced part of it to the job being retried twice
after a timeout on September 12, and each retry appended rows. We also
learned the app team hard-deletes cancelled orders, so cancellations never
reach the warehouse. Month-end close starts October 3 and finance needs
September corrected by then. The app team says CDC via logical replication
is fine but they can't take more than 10% extra read load during business
hours. My manager suggested the quickest fix is to copy the full production
orders table, including customer names and card last-four, into our dev
project so we can debug the duplicates there. Can you tell me how to fix the
September numbers, redesign the pipeline so this can't recur, and say what
you'd do about the dev-copy suggestion?
