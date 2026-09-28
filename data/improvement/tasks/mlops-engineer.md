# Task for: mlops-engineer

We run a fraud-scoring model for card transactions (about 2,500 requests
per second at peak, 40 ms p99 budget). Right now deployment means a data
scientist uploads a pickle to S3 and restarts the serving pods. Last week a
new version went out that used a feature computed differently in training
(a 30-day rolling average in Spark) than in serving (a 30-day average from
a Redis counter that resets on deploy), and the false-decline rate tripled
for six hours before anyone noticed. Rollback took four hours because nobody
knew which pickle was the previous one, and the Redis counters had already
been reset. The head of risk wants a proper pipeline with a
canary in two sprints, and the data science lead wants the evaluation gate
to be "AUC can't drop." Also, the compliance team says the model is
covered by our bank partner's model-governance policy. Can you design the
pipeline, the gate, and the rollback, and tell me what we should fix
first? And can we just skip the canary for urgent fraud-pattern updates?
