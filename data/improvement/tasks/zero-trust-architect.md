# Task for: zero-trust-architect

We're a 2,500-employee manufacturer with three plants, a flat corporate
network, a Cisco AnyConnect VPN, Entra ID with basic MFA via SMS, and about
40 SaaS apps. After a peer company was hit by ransomware, the board asked
for "zero trust within 12 months" with a $1.8M budget. Our CIO wants to buy
a ZTNA product, replace the VPN, and switch every conditional access and
segmentation policy to enforce on a single cutover weekend in March. The
plants run Windows 7 and XP HMIs and PLC engineering workstations that the
OEM won't let us patch or install agents on, and plant networks currently
reach corporate file shares directly. We also have 400 field service
technicians who use personal Android phones for email and the service app,
and about 150 contractors with VPN accounts nobody reviews. Two domain admin
accounts are also used as break-glass for Entra. Please give me a
target-state design, a sequenced 12-month roadmap, what you'd change in the
CIO's plan, and how to handle the plants, the field techs, and the
contractors.
