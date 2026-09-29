# Task for: b2b-product-manager

We sell a project-management SaaS (about 600 customers, mostly 50-500 seats)
and our AE is closing a 4,000-seat deal worth $1.4M ARR with a European
bank. Their security team sent a 280-question questionnaire and three
"must-haves" before signature on December 15: SAML SSO with SCIM
provisioning and automatic deprovisioning, all customer data stored and
processed only in the EU, and a custom four-level approval workflow on task
status changes that mirrors their internal change-control process. We have
SAML but no SCIM, everything runs in a single US region today, and nobody
else has ever asked for approval chains. The AE has already told them in
writing that EU hosting is "on our roadmap for Q1" and wants me to confirm
that, plus draft the data-residency clause for the DPA so legal can move
faster. Two other deals in the pipeline (about $300k each) have also asked
about SCIM. Engineering says we have roughly one squad for the next
quarter. What do we build, what do we answer contractually, what do I tell
the AE about the Q1 promise, and how do I avoid turning us into this bank's
custom dev shop?
