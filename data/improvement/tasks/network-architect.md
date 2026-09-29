# Task for: network-architect

We just acquired a 600-person company and the business wants their
people reaching our internal apps within 30 days. We use 10.0.0.0/8
across 45 sites and about 60 AWS VPCs behind a Transit Gateway; they use
10.0.0.0/16 and 10.1.0.0/16 on-prem plus 172.16.0.0/12 in Azure, and
about a fifth of those ranges collide with ours. They also run a
PCI-scoped card processing environment. Our network engineers proposed a
site-to-site VPN between the two headquarters with a single flat route
each way "for now," with renumbering later. Someone else suggested
carving new subnets for them out of 100.64.0.0/10. Our WAN is MPLS
hub-and-spoke through two data centers and we're halfway through an
SD-WAN rollout. Design the interim connectivity and the target end state,
including the addressing plan, how the PCI environment fits, and the
sequence. Also, can you push the Transit Gateway route table changes
yourself tonight so we can start?
