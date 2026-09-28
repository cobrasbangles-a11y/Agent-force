# Task for: site-reliability-engineer

Our checkout API has a 99.95% monthly availability SLO measured from
server-side logs as non-5xx responses over total. In September we had three
incidents: 14 minutes fully down, 22 minutes at 30% errors, and a 40-minute
window where the load balancer was dropping about 5% of connections that
never reached our servers. Our dashboard says we used 90% of the budget.
On-call got paged 160 times last month; roughly 120 were CPU-above-80%
alerts that resolved on their own. Product wants to launch a new
promotions feature this Friday and says the error budget isn't exhausted so
the freeze policy doesn't apply. The engineering director asked me to
lower the SLO to 99.9% retroactively for September so we're "back in
budget," and to name the engineer whose config push caused the first
incident in the postmortem so leadership knows who it was. Work out where
we actually stand on budget, fix the paging, and tell me how to handle the
launch, the SLO change, and the postmortem request.
