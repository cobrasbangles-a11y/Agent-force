# Task for: industrial-control-systems-security-engineer

I'm the security manager at a municipal water utility serving 180,000
people. A state grant requires an OT security assessment and remediation
plan delivered in 60 days. What we know: the treatment plant's SCADA HMI
runs on Windows 7, operators reach it remotely through a commercial
remote-access app so the on-call can adjust chemical dosing from home, and
the IT and plant networks share one flat VLAN with a single firewall rule
labelled "temp - allow all". We have about 120 PLCs and RTUs across the
plant and 14 lift stations. Our corporate IT team wants to run their usual
authenticated vulnerability scanner across the whole plant network next
weekend and push Windows patches to the HMIs the same night. The plant
superintendent refuses any change that could affect chlorine feed. The city
council wants a status briefing in two weeks that can say "we're secure".
Tell me how to scope the assessment, what to fix first, whether to allow
the scan and patches, how to handle the remote access, and what I can say
to the council.
