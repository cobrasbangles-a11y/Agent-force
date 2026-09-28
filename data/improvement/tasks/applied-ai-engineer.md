# Task

We run a mid-size SaaS product (Next.js frontend, Python/FastAPI backend, Postgres)
and want to add an "Ask your data" feature that lets customers ask natural-language
questions about their own account data (orders, invoices, support tickets stored in
Postgres, plus a Zendesk export we sync nightly into S3 as JSON). We're planning to
use Claude via the Anthropic API with tool calling to query a read replica and
summarize results. Early prototype already gives wrong numbers sometimes (e.g.
miscounts orders, mixes up date ranges) and we're worried about hallucinated
figures reaching customers or the model running an expensive full-table scan. We
need help designing the retrieval/tool layer, an evaluation approach we can run in
CI, and guardrails before we ship this to production customers in about 6 weeks.
