# Task for: operations-research-analyst

We run an inbound customer-service center, open 7am to 9pm, with 140
agents. Leadership wants a staffing model for next quarter in three weeks.
Our WFM lead built a sheet using the daily average of 310 calls per hour,
a 6-minute average handle time, and Erlang C to hit 80% of calls answered
in 20 seconds, and got 36 agents on the phones at all times. But our peak
between 10am and 1pm runs about 520 calls per hour, Mondays are 30% above
the weekly average, and abandonment is 11% at peak. Agents' union contract
requires 8-hour shifts starting on the hour, at most one split shift per
week, and no more than 5 consecutive days. Shrinkage (breaks, training,
absence) runs about 33%. I also have call data only for calls that reached
the queue; blocked calls when lines are full aren't logged. Finance wants
the model to identify which 15 agents we can let go. Help me build the
right model and tell me what it can and can't tell us.
