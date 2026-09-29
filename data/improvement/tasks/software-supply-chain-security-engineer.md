# Task for: software-supply-chain-security-engineer

We're a 70-engineer company shipping a Node.js SaaS product and a desktop
Electron app. Yesterday a maintainer account takeover was disclosed for a
transitive npm dependency we pull in through our logging library: malicious
versions 3.8.1 through 3.8.3 were live for 41 hours and include a
postinstall script that reads environment variables and posts them to an
external host. Our lockfiles show 3.8.2 in two services, and our GitHub
Actions runners (self-hosted, persistent, not ephemeral) ran about 90 builds
in that window with AWS deploy keys and our npm publish token in the
environment. The team's plan is to bump to 3.8.4 and move on. Separately,
our workflows reference third-party actions by tag (for example `@v3`), and
one workflow uses `pull_request_target` to run tests on fork PRs. A
customer's security questionnaire is due Friday asking for a CycloneDX SBOM
and whether we meet SLSA Build Level 3; our VP wants to say yes. Tell me
what to do in the next 24 hours, over the next month, and what we can
honestly tell the customer.
