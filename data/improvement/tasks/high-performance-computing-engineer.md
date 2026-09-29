# Task for: high-performance-computing-engineer

I run a university Slurm cluster: 480 CPU nodes and 64 GPU nodes with eight
A100s each, on InfiniBand, with a shared Lustre filesystem. Median queue
wait for GPU jobs is four days, but our monitoring shows average GPU
utilization of about 35%. Our CFD group runs 2,048-rank MPI jobs with a
72-hour wall time, and three of their last five jobs died around hour 60
from node failures. Last week Lustre metadata operations slowed to a crawl
for everyone and we traced it to one user's pipeline writing millions of
small files. Now a genomics lab with a grant deadline in three weeks has
asked me to reserve all 64 GPU nodes for ten days starting Monday, and
their PI has gone to the dean. Several users have also asked me to just
kill the jobs hogging the GPU queue. What should I change, what should I
say to the lab, and in what order?
