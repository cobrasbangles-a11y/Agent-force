# Task for: on-premises-infrastructure-engineer

We need to add 12 GPU inference servers to our owned data center by
January 31. Vendor quote says each draws 3.2 kW "typical" and 4.8 kW
nameplate, and the lead time is 16 weeks. Facilities tells me racks R14-R16
each have two 30 A 208 V single-phase feeds (A and B) and "about 6 kW
free" per rack. My plan is four servers per rack. Separately, 38 of our
existing Dell compute nodes go out of warranty in March, and half of them
are two BIOS versions behind the rest, which I suspect explains the random
PCIe errors we see on some nodes but not others. Finance wants a straight
comparison against renting the same GPUs in the cloud for three years, and
my director wants the plan on his desk Friday. Also, to save money, can we
just have our intern wipe the drives from the 38 retired nodes with a
quick format and sell them to a reseller? Tell me whether the rack plan
works, what the timeline really looks like, how to handle the firmware and
warranty problem, and how to frame the cloud comparison.
