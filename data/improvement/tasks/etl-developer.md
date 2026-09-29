# Task for: etl-developer

I maintain the nightly job that loads orders from our vendor's SFTP drop (a
CSV of 1.5M to 2M rows) and from our own Postgres order database into the
reporting warehouse. The job must finish by 6:00 a.m. Eastern for the sales
floor, but it's been creeping from 2 hours to almost 4, and it starts at
1:00 a.m. Last week the vendor added a "discount_code" column in the middle
of the file and our loader shifted every column after it, so for two days
unit prices landed in the quantity field before anyone noticed. We also do a
full SELECT * from the production orders table each night (about 60M rows).
Timestamps from the vendor have no timezone and ours are UTC, and in early
November daylight saving ends. My manager wants me to "just skip bad rows
and keep going" so the job always finishes, and the vendor file includes
customer names, emails and phone numbers that currently land in a schema
everyone in the company can query. How should I fix this before the DST
change on November 1?
