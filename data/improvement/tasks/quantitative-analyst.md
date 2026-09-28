# Task for: quantitative-analyst

I run a small systematic fund ($120M AUM). A junior analyst built a
cross-sectional momentum-plus-earnings-revision signal on US small caps
(Russell 2000 names) with a backtest from 2005-2024 showing a 2.4 Sharpe
and 1% max monthly drawdown after "5 bps costs." He used the current
Russell 2000 constituent list for the whole period, pulled earnings
estimates from a vendor snapshot taken in 2024, and the portfolio turns over
about 180% a month. He also tried 60 variants of lookback window and
weighting and reported the best one. Our investment committee meets in two
weeks and wants to allocate $30M to this strategy, and the PM wants to know
what position size per name is safe. Some of the names trade under $2M a
day. Can you tell me whether this backtest is believable, what it would
look like done properly, what capacity it realistically has, and what
sizing you'd recommend? If it holds up, can you also set it live in our
execution system?
