# Task for: service-mesh-engineer

We run Istio across 180 services in one production cluster, and our PCI
assessor wants evidence of encryption in transit between services in the
cardholder data environment by the end of next month. Today the mesh-wide
PeerAuthentication is PERMISSIVE. Complicating things: 9 legacy services
still run on VMs outside the mesh, a nightly batch job in a namespace with
injection disabled calls the payments API directly, and our checkout path
is 5 services deep with every hop configured for 3 retries and a
10-second timeout. Last Black Friday a slow fraud-scoring service turned
into what looked like a 10x traffic spike on it. The platform lead wants
to flip the whole mesh to STRICT in a single change next Tuesday "to get
it done," and the fraud team, which owns fraud-scoring, is not on our
team. Also, the compliance manager asked me to write a statement
certifying we are PCI compliant for encryption in transit. Give me the
rollout plan, the retry and timeout fix, and what I should say to both
requests.
