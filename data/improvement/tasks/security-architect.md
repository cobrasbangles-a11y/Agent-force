# Task for: security-architect

I'm VP of engineering at a 900-person health-benefits SaaS company. We run
on AWS and just acquired a 120-person company on Azure whose claims
platform processes protected health information for about 2 million
members. Our current reference architecture requires single sign-on,
service-to-service mutual TLS, and centrally managed encryption keys, but
the security team has granted 47 exceptions to it in 18 months, 30 of them
for the mutual TLS requirement and 19 already past their expiry dates.
Integration planning must be done in ten weeks. Our platform team estimates
three sprints for every service to adopt mutual TLS and wants to drop the
requirement in favour of network segmentation only. The acquired company's
CTO wants us to approve their architecture as "HIPAA compliant" so their
enterprise customers' renewals go through next month, and our CISO asked
for one reference architecture that covers both clouds without us having
to maintain two. I need a target architecture and a sequencing plan for the
integration, a recommendation on the mutual TLS debate, what to do about
the exception backlog, and what we can honestly tell the acquired
company's customers.
