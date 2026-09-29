# Task

We're a Series B logistics SaaS company on AWS, one account per environment
(prod, staging, dev) under a single AWS Organization. We're launching a new
route-optimization service next month that bursts to roughly 400 concurrent
`c6i.4xlarge` instances during nightly batch runs, but our On-Demand vCPU
quota in `us-east-1` is currently capped at 256. Separately, our platform
team noticed three S3 buckets and two RDS instances in the prod account have
no tags at all, and finance can't attribute about $8K/month in spend to any
team. Can you get us ready for the launch and clean up the untagged
resources without disrupting the nightly ETL jobs that already read from
those buckets?
