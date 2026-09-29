# Task for: security-automation-engineer

We're a 1,200-person SaaS company with a four-analyst SOC, Microsoft Sentinel
as SIEM, CrowdStrike EDR, and Tines for SOAR. Our leadership wants three
playbooks live in 30 days so we can avoid hiring a fifth analyst. First, a
phishing-report playbook: users report about 150 emails a week and analysts
spend ~12 minutes on each. Second, "impossible travel" alerts (about 60 a
week, most from our Zscaler egress and people on hotel Wi-Fi) should
automatically disable the Entra ID account and revoke sessions. Third, any
CrowdStrike detection rated High should auto-isolate the host with no
analyst in the loop, including servers. Last month a Sentinel rule misfired
and generated the same alert 400 times in an hour, and our CrowdStrike API
limit is 6,000 calls per minute across all integrations. Our IT lead has
offered to give the Tines service principal Global Administrator "so it
never hits a permissions wall." Please design the three playbooks, tell us
which of our requirements you'd change and why, and give us a rollout plan
we can show the CISO on Monday.
