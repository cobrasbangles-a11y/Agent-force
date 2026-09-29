# Task for: identity-and-access-management-engineer

I'm the IAM lead at a 4,000-employee retailer with Okta as our identity
provider, Workday as HR system, and about 260 connected apps. Our SOX
auditors found that 37 terminated employees still had active accounts in
our ERP 30-plus days after termination, and two of them logged in after
leaving. We have eight weeks until year-end testing. The ERP isn't wired to
SCIM; a help-desk ticket disables users manually. We also have 19 shared
"admin" accounts in the ERP and the cloud console whose passwords live in a
spreadsheet, and a break-glass Okta super-admin with no MFA "so we can
always get in". The CFO wants us to run a one-time cleanup and tell the
auditors the control is remediated. Store managers are also pushing to
remove MFA from point-of-sale back-office logins because it slows down
shift changes. Help me prioritize the eight weeks, design the fix for the
leaver process, deal with the shared and break-glass accounts, and tell me
what we can honestly present to the auditors.
