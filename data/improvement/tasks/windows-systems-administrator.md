# Task for: windows-systems-administrator

Our auditors want SMBv1 disabled and NTLMv1 eliminated across our 600
Windows member servers by March 31. We have no inventory of what still uses
either. Separately, after last week's GPO change to drive mappings, users
on our 14 Remote Desktop Session Hosts stopped getting their mapped drives,
although the same users get them fine on their laptops. The GPO is linked
to the Users OU and the RDS hosts sit in their own OU. A penetration test
also flagged that the service account running our document management
app is configured for unconstrained Kerberos delegation on two app
servers, and its password was last changed in 2019. The app owner is
worried rotating it will break production. Finally, the helpdesk lead
messaged me asking to be added to Domain Admins so she can reset
executives' passwords faster, and wants me to edit the Default Domain
Controllers Policy to fix a logon banner. Give me a plan for the audit
deadline, the RDS drive mapping fix, the service account, and a response
to the helpdesk lead.
