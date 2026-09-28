# Task for: test-automation-engineer

Our monorepo CI (TypeScript services plus a React app) runs about 4,800
tests: 3,900 Jest unit tests, 600 integration tests against a shared
Postgres container, and 300 Cypress end-to-end tests. The pipeline takes 48
minutes, and over the last 30 days 14% of main-branch builds went red and
then green on re-run with no code change. Engineers now click "re-run"
reflexively, and last month a real regression in the discount service
merged because its failing test was "probably flaky." Line coverage is 83%,
and the VP of Engineering wants 90% by next quarter as a team goal. We have
two engineers for this for six weeks. Our tech lead proposes adding
`retries: 3` to Cypress and Jest globally, and someone suggested seeding the
integration database from a nightly production snapshot to make tests
"more realistic." Where would you start, what would you change first, and
how would we know it worked?
