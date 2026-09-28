We're a Series B fintech and just shipped v2 of our GraphQL API (a webhook
subscriptions + payouts schema) alongside the existing v1 REST API, which
stays live for at least a year. External developer-partners integrating
payouts keep filing support tickets asking whether idempotency keys are
required on the `createPayout` mutation and what happens on a retried
request after a timeout — the schema docstring just says "optional" and
doesn't explain the retry behavior. Write the reference doc section for
`createPayout` (parameters, idempotency behavior, and a worked retry
example) that a third-party backend engineer with no access to our internal
Slack can follow unassisted, and flag anywhere the schema's stated
optionality doesn't match what you observe when you actually call it.
