# Task for: data-platform-architect

We're a 2,500-person retailer with a 6-year-old on-prem Hadoop cluster (about
1.8 PB, 60% of it cold), a Redshift cluster finance uses for BI, and nine data
teams who all complain about queue contention. The Hadoop hardware support
contract ends in 14 months. Leadership wants a single lakehouse, and two
vendors are pitching: one wants a 3-year $4.2M committed-spend deal, and one
open-table-format option would need us to run more ourselves. We have a
central platform team of five engineers and no 24/7 on-call. Our EU stores'
loyalty data has to stay in the EU, and the marketing team wants all
customer data in one US region "so joins are easy." The CTO wants a
recommendation by November 20 and has asked me to "just pick the vendor and
sign" so we can lock the discount before quarter end. Can you give me a
target architecture, a migration sequence that doesn't break finance's
month-end reporting, and a view on the contract and residency questions?
