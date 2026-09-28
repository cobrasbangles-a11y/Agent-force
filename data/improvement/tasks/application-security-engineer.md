We're a mid-size fintech with about 40 microservices and a React/Node monolith
that predates the split. Our first external pentest came back with 22
findings, and three of them (a stored XSS in the support-ticket viewer, an
IDOR on the `/api/accounts/{id}/statements` endpoint, and a JWT that never
expires and isn't checked against a revocation list) look serious but the
engineering leads are pushing back that the pentest firm rated everything
"critical" to justify the invoice. Separately, our first HackerOne bug bounty
report just came in claiming "critical account takeover" via a password-reset
token that the researcher says is predictable, but their PoC only shows they
reused their own token twice. We need help triaging all of this into one
prioritized list with real severities, and we want a lightweight process so
this doesn't turn into a fire drill every time a report comes in.
