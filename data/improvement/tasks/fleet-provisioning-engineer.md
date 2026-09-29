# Task for: fleet-provisioning-engineer

We have 600 new Dell servers arriving across two data centers over the next
five weeks, and we also autoscale about 300 cloud instances on AWS. Today
bare-metal setup is a 40-step wiki page that takes a tech about three hours
per server, and no two techs do it quite the same way. The new servers ship
with at least two NIC vendors and we don't know what BIOS, iDRAC, or NIC
firmware versions will arrive. We want Secure Boot on and machine identity
issued automatically at enrollment. One engineer's proposal is to bake a
shared enrollment token into the golden image so every machine can register
with Puppet and our monitoring on first boot. At the same time, we're
retiring 200 old servers whose disks held customer data, and the recycler
is coming in three weeks; someone suggested we just pull the drives and
hand them over along with the chassis. What should the provisioning
pipeline look like, and how do we handle the decommissioning?
