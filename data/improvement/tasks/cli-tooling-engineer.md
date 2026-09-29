# Task for: cli-tooling-engineer

I maintain `deployctl`, an internal Python CLI that about 400 CI pipelines and
250 engineers use every day. Cold start is 1.1 seconds, and several pipelines
call it in a loop over 300 services. For v3, due November 1, product wants
three things: colored output with a new "owner" column in the `deployctl list`
table, `--env` renamed to `--environment` because it's clearer, and an
automatic update check against our GitHub releases API on every invocation so
people stay current. Last week, someone's cron job ran `deployctl purge
--older-than 30d` against the wrong context and deleted production release
artifacts. There was no prompt because the command never asked. The obvious
fix is to add an "Are you sure? [y/N]" prompt to purge. Many pipelines parse
`deployctl list` with `awk '{print $3}'`, and some pipe it into `head`, which
currently spits out a BrokenPipeError traceback. Can you design the v3
interface changes and tell me how to ship them without breaking anyone?
