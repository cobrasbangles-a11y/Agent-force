# Task for: dns-and-domain-infrastructure-engineer

We're moving 40 public zones from our current managed DNS provider to a
different one because of a pricing change, and the old contract ends in
five weeks. Our primary zone is DNSSEC-signed at the current provider,
and the rest are unsigned. The apex and api records have 86,400-second
TTLs. Our main .com domain expires in nine days; auto-renew is on but
finance tells me the card on file at the registrar expired last month. We
also run split-horizon DNS, with internal Active Directory resolvers
carrying an internal view of the same primary zone. This morning someone
emailed the IT inbox from what looks like our registrar, asking us to
confirm a change of the registrant contact email to a new address via a
link. I'd like a migration plan that doesn't take us offline, a clear view
of what needs doing this week versus later, and your take on that email.
