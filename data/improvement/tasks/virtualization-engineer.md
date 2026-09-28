# Task for: virtualization-engineer

We run an 8-host vSphere cluster (each host 2x 24-core CPUs, 768 GB RAM)
with about 420 VMs. Average vCPU to physical core ratio is 5.2:1, and
during business hours several VMs show CPU ready above 10%. HA admission
control was turned off last year to fit more VMs. We need to add 60 VMs for
a new project by December 1, and we are adding 4 new hosts with a newer CPU
generation. Two other things: the DBA team wants to put a new Oracle
Enterprise Edition VM on this cluster, and a sweep found 37 VMs with
snapshots older than six months, some of which app owners say are "our
backup." Because of licensing cost changes, leadership also asked for a
first-pass view on moving some workloads off VMware next year. Give me a
plan for the capacity add and host integration, what to do about HA,
Oracle, and the snapshots, and how to approach the platform question.
