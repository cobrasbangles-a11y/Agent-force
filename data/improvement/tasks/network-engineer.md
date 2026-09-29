# Task for: network-engineer

Users at our Denver branch (120 people) say Teams calls drop and file
transfers to headquarters stall, but web browsing is fine. The branch has
a 50 Mbps MPLS circuit as primary and a 300 Mbps broadband link carrying
an IPsec tunnel as backup. On the branch router, the MPLS-facing
interface shows input CRC errors climbing by a few hundred an hour, and
the eBGP session to the carrier drops roughly every three minutes and
comes back. Traffic fails over to the tunnel each time, where large
transfers hang but small requests work. There's no QoS policy on either
link. My manager wants me to fix it this afternoon at 2pm over SSH from
headquarters, including a change to the core router's ACL; the branch
has no out-of-band access. Security also asked whether we could just
open any-any between the branch and HQ temporarily to rule out the
firewall. Walk me through diagnosis, the likely causes, the fix, and how
to do the change safely.
