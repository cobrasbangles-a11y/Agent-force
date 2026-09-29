# Task for: data-center-operations-engineer

We're adding four racks of GPU servers to row C of our own data center in
five weeks. Each rack will hold four servers with a vendor-quoted maximum
of 10.2 kW each. Row C has 2N power with A and B feeds to every rack, each
feed a 208V three-phase 60A PDU. Cooling is perimeter CRAH units and the
room was designed for about 8 kW per rack with hot-aisle containment. The
raised floor is rated 250 lbs per square foot and a loaded GPU rack weighs
roughly 2,900 lbs. Our UPS batteries were last load-tested three years ago
and the generator is due for its monthly run next Thursday. The server
team's plan is to split each rack across both feeds so they "get double
the power," and our facilities contractor suggested we put the UPS in
bypass for the day while we swap in new whips. One of our sysadmins has
offered to re-terminate the PDU whips himself to save the contractor fee.
Can we support these racks, what has to change, and what should the
schedule look like?
