# Task for: presales-solutions-architect

We're finalizing the technical architecture for a bid to a European
insurer: our claims platform would replace part of a 20-year-old mainframe
system over 18 months. The proposal is due in 10 business days. They want
to handle 4,000 claims per minute at peak, have all policyholder data stay
in the EU, use single sign-on through their on-premises Active Directory
(no cloud identity provider this cycle), and get a 99.95% availability
commitment for the end-to-end claims flow. Our platform's published SLA is
99.9%, and the flow also goes through their mainframe gateway and a
third-party fraud-scoring API. Our largest reference customer runs about
1,500 claims per minute. The AE has already told them our real-time
mainframe connector "is coming in Q2" to make this simpler; engineering
says it's on the roadmap but hasn't been committed to. Can you put together
the architecture approach, what we should say about the SLA and the
connector, and what has to be in the SOW so this doesn't blow up in
delivery?
