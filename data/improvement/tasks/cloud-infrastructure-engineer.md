# Task for: cloud-infrastructure-engineer

We're on AWS with an Organization of about 30 accounts, and we just signed
a German customer who needs their workload in eu-central-1 in three weeks.
Our org has only ever run in us-east-1 and us-west-2. The ML team says they
need 400 vCPUs of G5 instances for the launch; our G and VT instance quota
in the new region is sitting at the default. Separately, our NAT gateway
line item went from $3,100 to $12,400 a month over the last two months and
nobody can tell me why. During an incident last Tuesday an engineer opened
port 5432 on a production security group to 0.0.0.0/0 from the console "to
test connectivity" and I'm not sure it was ever closed. Finally, the ML lead
has asked for AdministratorAccess on the production launch role "just for
launch week" so they aren't blocked by permission errors. Can you give me a
plan for the new region, tell me what to do about the NAT spend and the
security group, and tell me how to answer the admin access request? I need
something I can take to the platform lead on Monday.
