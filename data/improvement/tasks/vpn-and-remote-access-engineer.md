# Task for: vpn-and-remote-access-engineer

We have 1,800 remote-capable employees and a pair of VPN concentrators
licensed for 1,000 concurrent users combined, full-tunnel, with username,
password, and push MFA. On the last snow day roughly 1,400 people tried to
connect at 8:30 a.m., the concentrators hit their license cap, and about a
third of staff could not work until noon. Around 60 contractors connect
through a separate IPsec profile that uses a single shared pre-shared key
that has not changed in three years. Security wants to pilot a zero-trust
access product next quarter, but we need a fix before winter. Networking
proposes turning on split tunneling for everything to cut load, but our
compliance team requires web traffic from corporate laptops to go through
our secure web gateway. Last week an employee reported approving an MFA
push they didn't initiate. Also, our CFO emailed asking me to let his
personal iPad connect without the posture check. Tell me what to do before
winter, what to do about the contractors, the MFA report, and the CFO.
