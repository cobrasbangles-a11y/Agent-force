# Task for: devops-engineer

We have a monorepo on GitHub with four services and a shared library,
deployed to EKS. Our GitHub Actions pipeline takes 45 minutes on every
push, builds and tests all four services regardless of what changed, and
fails about one run in five on tests that pass on retry, so people just
re-run it. Deploys to production rebuild the image from the git tag on
main rather than reusing what we tested in staging. AWS access is an IAM
user's long-lived access key stored as a repository secret. We accept
external contributions to the shared library, and someone added a
pull_request_target workflow so fork PRs can run the integration tests,
which need the AWS key. I want this pipeline under 15 minutes with a
canary for the payments service within a month. Also, there's a payments
hotfix that needs to go out this Friday, but we're in a change freeze until
Monday and the freeze owner is on a flight. What should we change first,
and what do we do about Friday?
