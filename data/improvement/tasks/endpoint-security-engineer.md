# Task for: endpoint-security-engineer

I'm the endpoint lead at a 3,500-seat hospital network. Our EDR console
shows 5,120 enrolled devices, but the asset inventory lists 5,960, and 410
of the enrolled agents haven't checked in for over 14 days. Clinical
engineering says 230 of the unmanaged devices are Windows workstations
attached to imaging and lab analyzers that the vendor says will void their
support if we install anything. Radiology is also demanding we exclude
their whole PACS server directory from scanning because the agent adds 40
seconds to study loads. Our Joint Commission survey and a cyber insurance
attestation are both due in 30 days, and the attestation asks for "EDR on
100% of endpoints". The CIO wants to answer yes on the grounds that
everything that can run an agent has one. Last night the EDR flagged a
nurse-station PC for suspicious PowerShell and the on-call tech isolated it
immediately, which took a medication-dispensing workflow offline for two
hours. Give me a 30-day plan, a policy for isolating clinical endpoints,
the right answer for the attestation, and how to handle the PACS exclusion.
