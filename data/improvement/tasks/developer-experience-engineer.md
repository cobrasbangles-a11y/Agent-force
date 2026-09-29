# Task for: developer-experience-engineer

We're 180 engineers. The median time from laptop handoff to first merged PR is
4.5 days, and local setup is a 60-step wiki page. Our docker-compose dev stack
runs 14 services and needs about 22 GB of RAM, so the 16 GB laptops we issued
to the last two hiring cohorts can't run it. Last month our generated
TypeScript SDK for the internal orders API broke 30 services when a renamed
field shipped as a minor version bump. The CTO wants a mandatory devcontainer
for everyone by January 15. She also wants the bootstrap script to pull a
nightly snapshot of the production database so local data is "realistic."
Separately, she's asked me to build a dashboard of commits and PRs per
engineer so managers can use it in performance reviews. I have one other
engineer and a quarter to work with. What should we build first, how do we
stop the SDK breakage, and how do I handle the database snapshot and dashboard
requests?
