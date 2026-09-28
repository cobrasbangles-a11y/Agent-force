# Task for: release-engineer

We ship a Node API (containers on Kubernetes), a public TypeScript SDK on
npm, and iOS/Android apps. Next Tuesday's release 4.8.0 bundles a new
"workspaces" feature, an SDK change that renames `client.projects.list()` to
`client.workspaces.list()`, and a Postgres migration that renames the
`projects` table to `workspaces` and drops two columns. Mobile apps go to
store review Thursday. Our last rollback, in March, failed because the
previous image tag `api:latest` had been overwritten, and nobody has
rehearsed one since we moved from Helm to Argo CD in June. Product wants
everything to go out together so marketing can announce on one day. Our
on-call lead asked me to "just approve it in the pipeline" because the
change advisory approver is on vacation. Please give me a release plan: the
versions, the ordering of API, SDK, migration and mobile releases, what the
rollback story is for each channel, and what I should push back on.
