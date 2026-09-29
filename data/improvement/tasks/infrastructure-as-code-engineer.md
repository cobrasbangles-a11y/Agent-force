# Task for: infrastructure-as-code-engineer

Our Terraform setup has grown into one root module with about 2,400
resources in a single S3-backed state file with a DynamoDB lock table,
shared by 14 teams. Last night a CI runner was killed mid-apply and the
state lock is still held; a senior engineer wants to run
`terraform force-unlock` and then apply from his laptop to finish the
change. Separately, we bumped our shared `rds` module from v2.4 to v3.0,
which sets `storage_encrypted = true` by default, and the plan for the
production account now shows `-/+` on four Postgres instances; the release
notes call it a "minor security improvement." Marketing also needs a
public S3 bucket for a campaign site by Thursday, and our OPA policy
blocks public buckets, so they've asked us to disable that rule for a
week. Leadership wants the monolithic state split by team before the end
of the quarter without any downtime. Tell me what to do about the lock,
the plan, the policy request, and give me a concrete plan for the state
split.
