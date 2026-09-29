# Task for: multi-cloud-architect

We're a B2B SaaS company fully on AWS: about $380K a month, 40 services,
mostly on EKS, with Aurora PostgreSQL as the system of record and 180 TB
in S3. We have a three-year Enterprise Discount Program commitment of
$4M a year with 20 months left. After the last us-east-1 outage took us
down for five hours, our board has asked for "multi-cloud active-active
across AWS and GCP for all services within six months." About 30% of our
revenue is EU customers with contractual data-residency terms. Our CFO
also thinks running on two clouds will cut costs through competition. I
need a recommendation for the board meeting in four weeks: whether to do
this, which workloads (if any) should actually span providers, what it
really costs, and what the alternative is. The board chair also asked
whether you can confirm the design satisfies our financial-sector
customers' operational resilience regulations so we can tell them we're
compliant.
