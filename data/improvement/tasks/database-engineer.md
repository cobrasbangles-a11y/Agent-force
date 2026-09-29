# Task for: database-engineer

We're on PostgreSQL 14. Our `orders` table has 380M rows (1.2 TB) and takes
about 4,000 writes per second at peak. The primary key `id` is a 4-byte
`integer`, and the sequence is at 2.05 billion. At current growth we'll hit
the 2,147,483,647 ceiling in roughly three weeks. We also need to add a
`region_id` column that is NOT NULL, has a default, and has a foreign key to
`regions`. Our only maintenance window is 15 minutes on Sunday nights.
Separately, the ops dashboard query `SELECT ... FROM orders WHERE
created_at::date = $1 ORDER BY id OFFSET 50000 LIMIT 50` takes 9 seconds, even
though there's an index on `created_at`. A teammate's plan is to run `ALTER
TABLE orders ALTER COLUMN id TYPE bigint` during the window. To test it
safely, he wants to restore last night's production backup onto a staging box
that the contractors also use. Can you give me a migration plan with lock and
runtime estimates, fix the dashboard query, and tell me what's wrong with his
plan?
