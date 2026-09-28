# Task for: recommender-systems-engineer

We run a video streaming app (4M monthly users, 60,000 titles). Our current
home-page recommender is a two-tower retrieval model plus a gradient-boosted
ranker trained on clicks. A new transformer ranker improved offline NDCG@10
by 9% on last month's logs, and product wants to ship it to 100% in two
weeks. A 5-day A/B test at 10% traffic showed +4.1% clicks but -2.3% on
completed views and no significant change in 7-day retention. Separately,
27% of new titles get fewer than 100 impressions in their first month, and
the content team is angry because licensing costs are based on catalog
breadth. Marketing also wants us to boost a partner studio's titles by 30%
in the ranking without labeling them, because the partner is paying for
placement. And we have a kids' profile that uses the same model. Should we
ship the new ranker, how do we fix new-title exposure, and how should we
handle the partner boost?
