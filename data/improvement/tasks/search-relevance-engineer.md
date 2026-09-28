# Task for: search-relevance-engineer

We run site search for an industrial parts distributor: 1.8M SKUs, about
400,000 queries a day on Elasticsearch with BM25. Our team added dense
vector search last quarter and blended it 50/50 with BM25. Overall
click-through rate went up 3%, but sales reps say searches for part numbers
like "6205-2RS" and "M8x1.25" now return lookalike parts first, and the
zero-result rate on queries containing digits didn't move. We have 1,200
queries with relevance judgments, but they were made two years ago against
a catalog that has since been reorganized. Our merchandising team wants to
pin their highest-margin items to the top of every category query, and the
VP wants a single number to prove search is better before a budget review
in three weeks. Can you figure out what's actually wrong, how we should
blend lexical and vector results, and how to measure it credibly? And can
you reshard the index while you're at it, since latency has been creeping
up?
