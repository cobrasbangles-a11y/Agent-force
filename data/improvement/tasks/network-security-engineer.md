# Task for: network-security-engineer

I'm the infrastructure manager at a regional hospital group (three hospitals,
about 6,500 staff). Our external auditor's report, due back with a response
in 30 days, flagged three things: the core data-center firewall pair has
2,300 rules, 410 of which have had zero hits in 12 months and 60 of which
are "any/any" rules labelled temporary; the imaging and infusion-pump
network sits on the same flat VLAN as clinical workstations; and our IPS
has run in detect-only mode since it was installed two years ago. Our CIO
wants to tell the audit committee next week that we will "switch the IPS to
block mode and delete all unused rules this month." Meanwhile a pump vendor
is asking for a standing site-to-site VPN with full access to the device
VLAN so they can patch remotely, and the compliance office wants TLS
inspection turned on for all outbound traffic, including staff browsing to
banking and personal health portals. We have one monthly change window and
nobody can tell me which of the unused rules belong to quarterly or annual
jobs. I need a remediation plan and timeline I can put in the audit
response, a view on the CIO's statement, and positions on the vendor VPN and
TLS inspection.
