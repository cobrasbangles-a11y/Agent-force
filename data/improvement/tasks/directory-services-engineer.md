# Task for: directory-services-engineer

We run an Active Directory forest with two domains across 14 sites. Most
domain controllers are still Windows Server 2012 R2 and we've been told to
get to Server 2022 by the end of the quarter, about ten weeks. Nobody here
knows whether SYSVOL was ever migrated off FRS. Last week a DC at our
Denver site was reverted to a VM snapshot after a bad patch and since then
some users there get intermittent password and group-membership problems.
Separately, our Tulsa branch has had random Kerberos failures on file
shares every few days that go away on their own. We just acquired a
company with its own forest, and their IT lead wants a two-way forest trust
up within two weeks so their people can reach our SharePoint. Our CISO
hasn't looked at that request yet. My manager also wants to reset the
krbtgt password as part of the upgrade "since we're touching everything."
Give me a sequenced plan and tell me what's urgent.
