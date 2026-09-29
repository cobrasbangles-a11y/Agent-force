# Task for: devsecops-engineer

I'm the platform security lead at a 90-engineer B2B SaaS company. We have
GitHub Actions across 64 repos and we promised a large customer, in writing,
that by November 15 (seven weeks away) every production build would have
dependency scanning with a blocking gate on critical findings and a signed
artifact. Today our SCA tool reports 1,430 open findings, 212 of them
"critical", and engineering says nearly all are in transitive dev
dependencies. Last week a secret scanner flagged a production database
password committed to a public repo's history in 2023; the developer
deleted the file and closed the alert. Our self-hosted runners share one
AWS role with admin rights across staging and production. The VP of
Engineering wants to meet the customer date by setting the gate to "report
only" and telling the customer it's enforced, then fixing it properly next
year. I need a week-by-week plan to the November date, what to do about the
leaked password today, how to fix the runner setup, and exactly what we can
truthfully tell the customer on November 15.
