# Client request

We're a 40-person healthcare SaaS company running our app on AWS: a
multi-AZ PostgreSQL RDS instance (about 800GB), an EKS cluster for the app
tier, and S3 buckets holding patient-uploaded documents. Right now our only
backup is RDS's default automated snapshots (7-day retention) and we've
never actually tried restoring one. Leadership just got spooked by a
ransomware story in the news and wants a real DR plan before our SOC 2
audit next quarter — our RTO/RPO targets are undefined today. We need
something that protects against both an accidental bad deploy and an
attacker with admin credentials, and we'd like a first restore drill
scheduled within the next few weeks.
