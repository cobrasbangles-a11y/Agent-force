# Task for: data-warehouse-engineer

We're on Snowflake and our monthly bill went from $38k to $71k in five
months. Our biggest table, fact_order_line, is about 4.2 billion rows,
clustered on load_timestamp because that's how the ingestion job writes it,
but almost every dashboard filters on order_date and store_id. The Monday
finance close dashboard takes 11 minutes and times out about once a month.
Analysts also built 30+ views that join fact_order_line to dim_customer,
and dim_customer is SCD Type 2 with about 18M rows, and one of the analysts
thinks revenue is "double counted sometimes." Revenue columns are FLOAT
because the original loader inferred types. Our CFO wants the bill under
$45k by the end of Q4 (December 31) and the close dashboard under a minute,
and one of our engineers suggested we just re-cluster the fact table in
place this weekend and switch everything to a 2XL warehouse during close.
Give me a plan: what's likely wrong, what you'd change, in what order, and
what it'll cost.
