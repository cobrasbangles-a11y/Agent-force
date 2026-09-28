# Task for: platform-engineer

We run a shared Kubernetes platform: 4 clusters, about 30 product teams,
roughly 900 deployments. Security wants two policies enforced by the end
of next week: every container must set CPU and memory requests and limits,
and every image must be signed and pulled from our internal registry. Our
audit shows 41% of deployments have no limits and about 120 still pull from
Docker Hub. Six teams are also still on v1 of our shared service Helm
chart, which we want to retire in favor of v2 (v2 renames several values
keys). Security's proposal is to install the admission webhook cluster-wide
in enforce mode on Monday with failurePolicy set to Fail. One team lead,
who is blocked on a launch, has asked me to give his team cluster-admin
"just for this week" so they can work around whatever breaks. Give me a
rollout plan for the policies and the chart migration, tell me what
Security's plan gets wrong, and how to answer the team lead.
