# Task

We're a 60-person fintech startup running our product on AWS (single payer
account, three linked accounts: prod, staging, dev). Our SOC 2 auditor just
flagged that our `prod` S3 bucket `acme-statements-prod` allows
`s3:GetObject` via a bucket policy with a wildcard principal, and it's been
that way for at least 90 days according to CloudTrail. Separately, we
noticed a Lambda execution role (`statement-generator-role`) has
`iam:PassRole` and `sts:AssumeRole` on `*`, which nobody can explain — it
was probably left over from a Terraform module someone copy-pasted. We need
this reviewed end to end: how exposed are we, what's the actual blast
radius, and what's the remediation plan we can hand to engineering this
week without breaking the nightly statement-generation job that depends on
that Lambda.
