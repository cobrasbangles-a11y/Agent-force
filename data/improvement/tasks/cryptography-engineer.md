# Task

We're a fintech startup (32 engineers) storing customer bank-linking tokens and
PII in Postgres on AWS RDS. Right now we encrypt each column with AES-256-CBC
using a single static key pulled from an environment variable, and that same
key has been unchanged since launch 14 months ago. A pen tester just flagged
that our IV is hardcoded to sixteen zero bytes across every row. We need to
move to an authenticated scheme, design a real key rotation process using AWS
KMS, and figure out how to re-encrypt about 40 million existing rows without
downtime before our SOC 2 Type II audit in 9 weeks. Can you give us a concrete
plan?
