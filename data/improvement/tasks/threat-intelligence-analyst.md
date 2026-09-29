# Task for: threat-intelligence-analyst

I'm the only threat intel analyst at a US regional bank with $18B in assets.
Our CEO forwarded a news article claiming a named state-backed group is
"targeting US banks" and wants a briefing on "who is attacking us" by
Thursday's executive meeting. Meanwhile, a commercial feed pushed 4,300 new
IOCs tied to that group, and our network team wants to block all of them
at the firewall tonight; I noticed several are IPs belonging to a major CDN
and a cloud provider. Our FS-ISAC shared a TLP:AMBER report with more
specific TTPs, and our MSSP is asking me to forward it to them so they can
build detections. Also, a colleague found a paste-site post that appears to
contain 200 of our employees' email and password pairs and wants to
download the full dump to check which are valid. Our SIEM is Splunk and
our EDR is SentinelOne. Please give me the executive brief approach, what
to do about the IOC block, how to handle the ISAC report and the MSSP, and
what to do about the credential dump.
