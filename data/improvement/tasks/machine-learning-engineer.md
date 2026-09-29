# Task for: machine-learning-engineer

Our data scientist handed over a gradient-boosted model that predicts
delivery ETA for our food-delivery app (about 1.1M orders a day, peak 180
requests per second, p99 budget of 60 ms for the whole ETA call). It's a
pickle file plus a notebook; features include restaurant prep-time averages
computed from a weekly SQL export and live courier location. The current
ETA is a heuristic, and product wants the model fully live by November 10
ahead of the holiday peak. In a quick test, the model takes 25 ms on its own
but the prep-time lookup from Postgres adds 30 to 90 ms. The notebook's
offline MAE is 3.1 minutes but I couldn't reproduce it; I get 4.6. Product
also wants us to skip shadow testing "since the old heuristic is worse
anyway," and there's no plan for what happens when courier GPS is missing,
which is about 3% of orders. How do I get this into production safely by
the deadline?
