# Task for: cryptography-engineer

I lead security at a 140-person health-records SaaS. Our PCI and HIPAA
audit evidence is due to the assessor in 12 days, and an internal review
just turned up three things. First, our document service encrypts patient
files with AES-256-GCM using one data key per tenant, created in 2019 and
never rotated; the nonce is a 96-bit random value, and we've encrypted
roughly 3.1 billion objects under the largest tenant's key. Second, the
master key that wraps those tenant keys lives in an environment variable on
18 app servers, and it appears in a 2021 Terraform state file that sat in
an S3 bucket readable by the whole engineering org. Third, our CTO wants to
tell the assessor our encryption is "FIPS validated" because the cloud KMS
is, and to push rotation to next quarter so it doesn't disrupt a product
launch. He has also asked whether we could just write a lighter-weight
scheme of our own for the mobile client, since the standard library is
"bloated". I need a prioritized plan for the next 12 days, what I can
honestly put in the audit evidence, and a rotation approach that doesn't
take the document service down.
